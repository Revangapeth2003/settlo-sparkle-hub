import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeads, FollowUp } from "@/contexts/LeadsContext";
import { format } from "date-fns";

interface EditFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp: FollowUp | null;
  leadName: string;
}

const EditFollowUpDialog = ({ open, onOpenChange, followUp, leadName }: EditFollowUpDialogProps) => {
  const [notes, setNotes] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [followUpDate, setFollowUpDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [workStatus, setWorkStatus] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateFollowUp } = useLeads();

  useEffect(() => {
    if (followUp) {
      setNotes(followUp.notes || "");
      setUpdatedBy(followUp.updated_by || "");
      setFollowUpDate(followUp.follow_up_date);
      setWorkStatus(followUp.work_status || "");
      setNextStep(followUp.next_step || "");
    }
  }, [followUp]);

  const handleSubmit = async () => {
    if (!followUp || !notes.trim() || !updatedBy.trim()) return;
    
    setIsSubmitting(true);
    await updateFollowUp(followUp.id, followUp.day_number, notes, updatedBy, followUpDate, workStatus, nextStep);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!followUp) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Day {followUp.day_number} Follow-Up</DialogTitle>
          <DialogDescription>
            Edit follow-up notes for <span className="font-semibold text-foreground">{leadName}</span>
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
            {isSubmitting ? "Updating..." : "Update Follow-Up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFollowUpDialog;
