import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLeads } from "@/contexts/LeadsContext";

interface FollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  nextDayNumber: number;
}

const FollowUpDialog = ({ open, onOpenChange, leadId, leadName, nextDayNumber }: FollowUpDialogProps) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addFollowUp } = useLeads();

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    
    setIsSubmitting(true);
    await addFollowUp(leadId, nextDayNumber, notes);
    setIsSubmitting(false);
    setNotes("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setNotes("");
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
              rows={6}
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
            disabled={!notes.trim() || isSubmitting}
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
