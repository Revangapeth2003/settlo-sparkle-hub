import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import type { FollowUp } from "@/contexts/LeadsContext";

interface FollowUpHistoryProps {
  followUps: FollowUp[];
}

const FollowUpHistory = ({ followUps }: FollowUpHistoryProps) => {
  if (followUps.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">No follow-ups yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {followUps.map((followUp) => (
        <Card key={followUp.id} className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  Day {followUp.day_number}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(followUp.created_at), "MMM dd, yyyy")}
              </div>
            </div>
          </CardHeader>
          {followUp.notes && (
            <CardContent className="pt-0">
              <CardDescription className="text-sm whitespace-pre-wrap">
                {followUp.notes}
              </CardDescription>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default FollowUpHistory;
