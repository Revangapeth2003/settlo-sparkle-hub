import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeads } from "@/contexts/LeadsContext";
import { format } from "date-fns";

interface FollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  nextDayNumber: number;
}

const FollowUpDialog = ({ open, onOpenChange, leadId, leadName, nextDayNumber }: FollowUpDialogProps) => {
  const [notes, setNotes] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [followUpDate, setFollowUpDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [workStatus, setWorkStatus] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addFollowUp } = useLeads();

  const handleSubmit = async () => {
    if (!notes.trim() || !updatedBy.trim()) return;
    
    setIsSubmitting(true);
    await addFollowUp(leadId, nextDayNumber, notes, updatedBy, followUpDate, workStatus, nextStep);
    setIsSubmitting(false);
    setNotes("");
    setUpdatedBy("");
    setFollowUpDate(format(new Date(), "yyyy-MM-dd"));
    setWorkStatus("");
    setNextStep("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setNotes("");
    setUpdatedBy("");
    setFollowUpDate(format(new Date(), "yyyy-MM-dd"));
    setWorkStatus("");
    setNextStep("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Day {nextDayNumber} Follow-Up</DialogTitle>
          <DialogDescription>
            Add follow-up notes for <span className="font-semibold text-foreground">{leadName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Follow-Up Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter what was discussed, next steps, concerns, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="updatedBy">Updated By</Label>
            <Input
              id="updatedBy"
              placeholder="Enter your name"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Date</Label>
            <Input
              id="followUpDate"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workStatus">Work Status</Label>
            <Input
              id="workStatus"
              placeholder="e.g., In Progress, Pending, Completed"
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextStep">Next Step</Label>
            <Textarea
              id="nextStep"
              placeholder="Enter the next action items..."
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!notes.trim() || !updatedBy.trim() || isSubmitting}
            className="gradient-primary"
          >
            {isSubmitting ? "Adding..." : "Add Follow-Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpDialog;
