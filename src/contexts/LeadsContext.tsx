import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type FollowUp = {
  id: string;
  lead_id: string;
  day_number: number;
  notes: string | null;
  created_at: string;
  updated_by: string | null;
  follow_up_date: string;
  work_status: string | null;
  next_step: string | null;
};

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
  followUps?: FollowUp[];
};

type LeadsContextType = {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id">) => void;
  updateLead: (id: string, lead: Omit<Lead, "id">) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  refreshLeads: () => Promise<void>;
  loading: boolean;
  addFollowUp: (leadId: string, dayNumber: number, notes: string, updatedBy: string, followUpDate: string, workStatus: string, nextStep: string) => Promise<void>;
  updateFollowUp: (followUpId: string, dayNumber: number, notes: string, updatedBy: string, followUpDate: string, workStatus: string, nextStep: string) => Promise<void>;
  deleteFollowUp: (followUpId: string) => Promise<void>;
  getLeadFollowUps: (leadId: string) => FollowUp[];
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [followUpsMap, setFollowUpsMap] = useState<Record<string, FollowUp[]>>({});

  useEffect(() => {
    fetchLeads();
    fetchAllFollowUps();

    const leadsChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    const followUpsChannel = supabase
      .channel('follow-ups-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follow_ups'
        },
        () => {
          fetchAllFollowUps();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(followUpsChannel);
    };
  }, []);

  const fetchLeads = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLeads([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive"
      });
    } else {
      const formattedLeads = data.map(lead => ({
        id: lead.id,
        name: lead.name,
        organization: lead.organization,
        email: lead.email,
        contactNumber: lead.contact_number,
        portfolio: lead.portfolio,
        leadType: lead.lead_type,
        leadSource: lead.lead_source,
        nextFollowUp: lead.next_follow_up,
        expectedRevenue: lead.expected_revenue,
        leadOwner: lead.lead_owner,
        requirements: lead.requirements,
        status: lead.status as Lead["status"]
      }));
      setLeads(formattedLeads);
    }
    setLoading(false);
  };

  const addLead = async (lead: Omit<Lead, "id">) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to add leads",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('leads').insert({
      user_id: session.user.id,
      name: lead.name,
      organization: lead.organization,
      email: lead.email,
      contact_number: lead.contactNumber,
      portfolio: lead.portfolio,
      lead_type: lead.leadType,
      lead_source: lead.leadSource,
      next_follow_up: lead.nextFollowUp,
      expected_revenue: lead.expectedRevenue,
      lead_owner: lead.leadOwner,
      requirements: lead.requirements,
      status: lead.status
    });

    if (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive"
      });
    } else {
      await fetchLeads();
    }
  };

  const updateLead = async (id: string, updatedLead: Omit<Lead, "id">) => {
    const { error } = await supabase
      .from('leads')
      .update({
        name: updatedLead.name,
        organization: updatedLead.organization,
        email: updatedLead.email,
        contact_number: updatedLead.contactNumber,
        portfolio: updatedLead.portfolio,
        lead_type: updatedLead.leadType,
        lead_source: updatedLead.leadSource,
        next_follow_up: updatedLead.nextFollowUp,
        expected_revenue: updatedLead.expectedRevenue,
        lead_owner: updatedLead.leadOwner,
        requirements: updatedLead.requirements,
        status: updatedLead.status
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      });
    } else {
      await fetchLeads();
    }
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive"
      });
    } else {
      await fetchLeads();
    }
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } else {
      await fetchLeads();
    }
  };

  const fetchAllFollowUps = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setFollowUpsMap({});
      return;
    }

    const { data, error } = await supabase
      .from('follow_ups')
      .select('*')
      .order('day_number', { ascending: true });

    if (error) {
      console.error('Error fetching follow-ups:', error);
    } else {
      const grouped = data.reduce((acc, followUp) => {
        if (!acc[followUp.lead_id]) {
          acc[followUp.lead_id] = [];
        }
        acc[followUp.lead_id].push(followUp);
        return acc;
      }, {} as Record<string, FollowUp[]>);
      setFollowUpsMap(grouped);
    }
  };

  const addFollowUp = async (leadId: string, dayNumber: number, notes: string, updatedBy: string, followUpDate: string, workStatus: string, nextStep: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to add follow-ups",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from('follow_ups').insert({
      lead_id: leadId,
      user_id: session.user.id,
      day_number: dayNumber,
      notes: notes,
      updated_by: updatedBy,
      follow_up_date: followUpDate,
      work_status: workStatus,
      next_step: nextStep
    });

    if (error) {
      console.error('Error adding follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to add follow-up",
        variant: "destructive"
      });
    } else {
      await fetchAllFollowUps();
      toast({
        title: "Success",
        description: `Day ${dayNumber} follow-up added successfully`,
      });
    }
  };

  const updateFollowUp = async (followUpId: string, dayNumber: number, notes: string, updatedBy: string, followUpDate: string, workStatus: string, nextStep: string) => {
    const { error } = await supabase
      .from('follow_ups')
      .update({
        day_number: dayNumber,
        notes: notes,
        updated_by: updatedBy,
        follow_up_date: followUpDate,
        work_status: workStatus,
        next_step: nextStep
      })
      .eq('id', followUpId);

    if (error) {
      console.error('Error updating follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to update follow-up",
        variant: "destructive"
      });
    } else {
      await fetchAllFollowUps();
      toast({
        title: "Success",
        description: "Follow-up updated successfully",
      });
    }
  };

  const deleteFollowUp = async (followUpId: string) => {
    const { error } = await supabase
      .from('follow_ups')
      .delete()
      .eq('id', followUpId);

    if (error) {
      console.error('Error deleting follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to delete follow-up",
        variant: "destructive"
      });
    } else {
      await fetchAllFollowUps();
      toast({
        title: "Success",
        description: "Follow-up deleted successfully",
      });
    }
  };

  const getLeadFollowUps = (leadId: string): FollowUp[] => {
    return followUpsMap[leadId] || [];
  };

  return (
    <LeadsContext.Provider value={{ 
      leads, 
      addLead, 
      updateLead, 
      deleteLead, 
      updateLeadStatus, 
      refreshLeads: fetchLeads, 
      loading,
      addFollowUp,
      updateFollowUp,
      deleteFollowUp,
      getLeadFollowUps
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
};
