import { useState } from "react";
import { Plus, Mail, Phone, Building, Calendar, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddLeadDialog from "@/components/AddLeadDialog";

export type Lead = {
  id: string;
  name: string;
  organization: string;
  email: string;
  contactNumber: string;
  portfolio: string;
  leadType: string;
  leadSource: string;
  nextFollowUp: string;
  expectedRevenue: string;
  leadOwner: string;
  requirements: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Doe",
      organization: "Tech Corp",
      email: "john@techcorp.com",
      contactNumber: "+1234567890",
      portfolio: "Settlo Tech Solutions",
      leadType: "Hot",
      leadSource: "Website",
      nextFollowUp: "2025-01-20",
      expectedRevenue: "$50000",
      leadOwner: "Sarah Smith",
      requirements: "Custom software development",
      status: "new"
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleAddLead = (lead: Omit<Lead, "id">) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
    };
    setLeads([...leads, newLead]);
  };

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
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
                            {lead.expectedRevenue}
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
                    
                    <div className="mt-4">
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
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <AddLeadDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddLead={handleAddLead}
        />
      </div>
    </div>
  );
};

export default Leads;
