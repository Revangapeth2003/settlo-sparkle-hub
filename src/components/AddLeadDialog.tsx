import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Lead } from "@/pages/Leads";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Omit<Lead, "id">) => void;
}

const AddLeadDialog = ({ open, onOpenChange, onAddLead }: AddLeadDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    contactNumber: "",
    portfolio: "",
    leadType: "",
    leadSource: "",
    expectedRevenue: "",
    leadOwner: "",
    requirements: "",
    status: "new" as Lead["status"]
  });
  const [nextFollowUp, setNextFollowUp] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nextFollowUp) {
      toast.error("Please select a follow-up date");
      return;
    }

    onAddLead({
      ...formData,
      nextFollowUp: format(nextFollowUp, "yyyy-MM-dd"),
    });

    toast.success("Lead added successfully!");
    
    // Reset form
    setFormData({
      name: "",
      organization: "",
      email: "",
      contactNumber: "",
      portfolio: "",
      leadType: "",
      leadSource: "",
      expectedRevenue: "",
      leadOwner: "",
      requirements: "",
      status: "new"
    });
    setNextFollowUp(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add New Lead
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio *</Label>
              <Select value={formData.portfolio} onValueChange={(value) => setFormData({ ...formData, portfolio: value })}>
                <SelectTrigger className="border-border bg-background/50">
                  <SelectValue placeholder="Select portfolio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Settlo Academy">Settlo Academy</SelectItem>
                  <SelectItem value="Settlo Tech Solutions">Settlo Tech Solutions</SelectItem>
                  <SelectItem value="Settlo HR Solutions">Settlo HR Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadType">Lead Type *</Label>
              <Input
                id="leadType"
                required
                value={formData.leadType}
                onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                className="border-border bg-background/50"
                placeholder="e.g., Hot, Warm, Cold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadSource">Lead Source *</Label>
              <Select value={formData.leadSource} onValueChange={(value) => setFormData({ ...formData, leadSource: value })}>
                <SelectTrigger className="border-border bg-background/50">
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Next Follow-up Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-border bg-background/50",
                      !nextFollowUp && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextFollowUp ? format(nextFollowUp, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={nextFollowUp}
                    onSelect={setNextFollowUp}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedRevenue">Expected Revenue *</Label>
              <Input
                id="expectedRevenue"
                required
                placeholder="$50000"
                value={formData.expectedRevenue}
                onChange={(e) => setFormData({ ...formData, expectedRevenue: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadOwner">Lead Owner *</Label>
              <Input
                id="leadOwner"
                required
                value={formData.leadOwner}
                onChange={(e) => setFormData({ ...formData, leadOwner: e.target.value })}
                className="border-border bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea
              id="requirements"
              required
              rows={4}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="border-border bg-background/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary hover:opacity-90 transition-opacity font-semibold">
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
