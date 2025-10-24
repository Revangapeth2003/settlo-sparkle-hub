import { FollowUp } from "@/contexts/LeadsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useLeads } from "@/contexts/LeadsContext";
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
import { useState } from "react";
import EditFollowUpDialog from "./EditFollowUpDialog";

interface FollowUpHistoryProps {
  followUps: FollowUp[];
  leadName: string;
}

const FollowUpHistory = ({ followUps, leadName }: FollowUpHistoryProps) => {
  const { deleteFollowUp } = useLeads();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);

  const handleEditClick = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (followUpId: string) => {
    setSelectedFollowUpId(followUpId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFollowUpId) {
      await deleteFollowUp(selectedFollowUpId);
      setDeleteDialogOpen(false);
      setSelectedFollowUpId(null);
    }
  };

  if (followUps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No follow-ups recorded yet
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {followUps.map((followUp) => (
          <Card key={followUp.id} className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  Day {followUp.day_number}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(followUp.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(followUp)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(followUp.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {followUp.updated_by && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Updated By: </span>
                  <span className="text-sm">{followUp.updated_by}</span>
                </div>
              )}

              {followUp.follow_up_date && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Date: </span>
                  <span className="text-sm">{format(new Date(followUp.follow_up_date), "MMM dd, yyyy")}</span>
                </div>
              )}

              {followUp.work_status && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Work Status: </span>
                  <span className="text-sm">{followUp.work_status}</span>
                </div>
              )}

              {followUp.notes && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Follow-Up Notes: </span>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap mt-1">
                    {followUp.notes}
                  </p>
                </div>
              )}

              {followUp.next_step && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Next Step: </span>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap mt-1">
                    {followUp.next_step}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <EditFollowUpDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        followUp={selectedFollowUp}
        leadName={leadName}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Follow-Up</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this follow-up? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FollowUpHistory;
