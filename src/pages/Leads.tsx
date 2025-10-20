import { useState } from "react";
import { Plus, Mail, Phone, Building, Calendar, DollarSign, Pencil, Trash2, Clock, RefreshCw } from "lucide-react";
import { useLeads, type Lead } from "@/contexts/LeadsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddLeadDialog from "@/components/AddLeadDialog";
import { toast } from "@/hooks/use-toast";
import { parseISO, isPast, isToday, differenceInDays } from "date-fns";

const Leads = () => {
  const { leads, updateLeadStatus, deleteLead, refreshLeads, loading } = useLeads();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    updateLeadStatus(leadId, newStatus);
    toast({
      title: "Status Updated",
      description: "Lead status has been updated successfully.",
    });
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsDialogOpen(true);
  };

  const handleDelete = (leadId: string) => {
    deleteLead(leadId);
    setDeletingLeadId(null);
    toast({
      title: "Lead Deleted",
      description: "Lead has been deleted successfully.",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLead(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLeads();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Leads have been refreshed successfully.",
    });
  };

  const filteredLeads = activeTab === "all" 
    ? leads 
    : leads.filter(lead => lead.status === activeTab);

  const getDueStatus = (nextFollowUp: string) => {
    try {
      const followUpDate = parseISO(nextFollowUp);
      if (isPast(followUpDate) && !isToday(followUpDate)) {
        const daysOverdue = Math.abs(differenceInDays(new Date(), followUpDate));
        return { label: `${daysOverdue}d overdue`, variant: "destructive" as const };
      }
      if (isToday(followUpDate)) {
        return { label: "Due today", variant: "default" as const };
      }
      const daysUntilDue = differenceInDays(followUpDate, new Date());
      if (daysUntilDue <= 3) {
        return { label: `Due in ${daysUntilDue}d`, variant: "secondary" as const };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const statusColors: Record<Lead["status"], string> = {
    new: "bg-blue-500 text-white",
    contacted: "bg-purple-500 text-white",
    qualified: "bg-green-500 text-white",
    proposal: "bg-yellow-500 text-white",
    won: "bg-emerald-600 text-white",
    lost: "bg-red-500 text-white"
  };

  const statusOptions: Lead["status"][] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage and track all your leads in one place</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              disabled={isRefreshing}
              className="gap-2 text-sm md:text-base"
            >
              <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="gradient-primary hover:opacity-90 transition-opacity font-semibold gap-2 text-sm md:text-base"
              size="lg"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Add Lead
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-6 md:mb-8">
            <TabsList className="grid grid-cols-7 w-full min-w-[700px] bg-card/50 backdrop-blur p-1 h-auto">
              <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                All ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                New ({leads.filter(l => l.status === 'new').length})
              </TabsTrigger>
              <TabsTrigger value="contacted" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                Contacted ({leads.filter(l => l.status === 'contacted').length})
              </TabsTrigger>
              <TabsTrigger value="qualified" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                Qualified ({leads.filter(l => l.status === 'qualified').length})
              </TabsTrigger>
              <TabsTrigger value="proposal" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                Proposal ({leads.filter(l => l.status === 'proposal').length})
              </TabsTrigger>
              <TabsTrigger value="won" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                Won ({leads.filter(l => l.status === 'won').length})
              </TabsTrigger>
              <TabsTrigger value="lost" className="data-[state=active]:gradient-primary data-[state=active]:text-white text-xs md:text-sm">
                Lost ({leads.filter(l => l.status === 'lost').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            <div className="grid gap-4">
              {filteredLeads.length === 0 ? (
                <Card className="p-8 md:p-12 text-center bg-card/50 backdrop-blur">
                  <p className="text-muted-foreground text-base md:text-lg">No leads found in this category</p>
                </Card>
              ) : (
                filteredLeads.map((lead) => {
                  const dueStatus = getDueStatus(lead.nextFollowUp);
                  
                  return (
                    <Card key={lead.id} className="p-4 md:p-6 border-2 border-border hover:border-primary transition-all bg-card/50 backdrop-blur group">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-xl md:text-2xl font-bold">{lead.name}</h3>
                              <Badge className={`${statusColors[lead.status]} text-xs md:text-sm`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="border-primary text-primary text-xs md:text-sm">
                                {lead.leadType}
                              </Badge>
                              {dueStatus && (
                                <Badge variant={dueStatus.variant} className="gap-1 text-xs md:text-sm">
                                  <Clock className="w-3 h-3" />
                                  {dueStatus.label}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="truncate">{lead.organization}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                                <span>{lead.contactNumber}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>Follow-up: {lead.nextFollowUp}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>₹{lead.expectedRevenue}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-medium">Portfolio:</span> 
                                <span className="truncate">{lead.portfolio}</span>
                              </div>
                            </div>
                            <div className="mt-3 space-y-1">
                              <p className="text-xs md:text-sm text-muted-foreground">
                                <span className="font-medium">Requirements:</span> {lead.requirements}
                              </p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                <span className="font-medium">Lead Owner:</span> {lead.leadOwner}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t">
                          <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}>
                            <SelectTrigger className="w-full sm:w-[200px] border-border bg-background/50">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(lead)}
                              className="border-primary text-primary hover:bg-primary/10"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeletingLeadId(lead.id)}
                              className="border-destructive text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>

        <AddLeadDialog 
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          editingLead={editingLead}
        />

        <AlertDialog open={!!deletingLeadId} onOpenChange={() => setDeletingLeadId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the lead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingLeadId && handleDelete(deletingLeadId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Leads;
