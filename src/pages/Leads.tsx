import { useState } from "react";
import { Plus, Mail, Phone, Building, Calendar, DollarSign, Pencil, Trash2 } from "lucide-react";
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

const Leads = () => {
  const { leads, updateLeadStatus, deleteLead } = useLeads();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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

  const filteredLeads = activeTab === "all" 
    ? leads 
    : leads.filter(lead => lead.status === activeTab);

  const statusColors: Record<Lead["status"], string> = {
    new: "bg-primary text-white",
    contacted: "bg-secondary text-white",
    qualified: "bg-accent text-white",
    proposal: "bg-yellow-500 text-white",
    won: "bg-green-500 text-white",
    lost: "bg-destructive text-white"
  };

  const statusOptions: Lead["status"][] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-muted-foreground">Manage and track all your leads in one place</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="gradient-primary hover:opacity-90 transition-opacity font-semibold gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 w-full mb-8 bg-card/50 backdrop-blur p-1 h-auto">
            <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              All ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              New ({leads.filter(l => l.status === 'new').length})
            </TabsTrigger>
            <TabsTrigger value="contacted" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Contacted ({leads.filter(l => l.status === 'contacted').length})
            </TabsTrigger>
            <TabsTrigger value="qualified" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Qualified ({leads.filter(l => l.status === 'qualified').length})
            </TabsTrigger>
            <TabsTrigger value="proposal" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Proposal ({leads.filter(l => l.status === 'proposal').length})
            </TabsTrigger>
            <TabsTrigger value="won" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Won ({leads.filter(l => l.status === 'won').length})
            </TabsTrigger>
            <TabsTrigger value="lost" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              Lost ({leads.filter(l => l.status === 'lost').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid gap-4">
              {filteredLeads.length === 0 ? (
                <Card className="p-12 text-center bg-card/50 backdrop-blur">
                  <p className="text-muted-foreground text-lg">No leads found in this category</p>
                </Card>
              ) : (
                filteredLeads.map((lead) => (
                  <Card key={lead.id} className="p-6 border-2 border-border hover:border-primary transition-all bg-card/50 backdrop-blur group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{lead.name}</h3>
                          <Badge className={`${statusColors[lead.status]} animate-pulse-glow`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="border-primary text-primary">
                            {lead.leadType}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="w-4 h-4 text-primary" />
                            {lead.organization}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-secondary" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-accent" />
                            {lead.contactNumber}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            Follow-up: {lead.nextFollowUp}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            ₹{lead.expectedRevenue}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-medium">Portfolio:</span> {lead.portfolio}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Requirements:</span> {lead.requirements}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">Lead Owner:</span> {lead.leadOwner}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}>
                        <SelectTrigger className="w-[200px] border-border bg-background/50">
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
                      <div className="flex gap-2">
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
                  </Card>
                ))
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
