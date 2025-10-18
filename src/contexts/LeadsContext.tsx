import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

type LeadsContextType = {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id">) => void;
  updateLead: (id: string, lead: Omit<Lead, "id">) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

const STORAGE_KEY = "settlo-leads";

const getInitialLeads = (): Lead[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
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
      expectedRevenue: "50000",
      leadOwner: "Sarah Smith",
      requirements: "Custom software development",
      status: "new"
    }
  ];
};

export const LeadsProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>(getInitialLeads);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = (lead: Omit<Lead, "id">) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (id: string, updatedLead: Omit<Lead, "id">) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...updatedLead, id } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    ));
  };

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, deleteLead, updateLeadStatus }}>
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
