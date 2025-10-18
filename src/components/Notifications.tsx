import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLeads } from "@/contexts/LeadsContext";
import { format, parseISO, isTomorrow, isToday, isPast } from "date-fns";

const Notifications = () => {
  const { leads } = useLeads();

  const upcomingFollowUps = leads.filter(lead => {
    const followUpDate = parseISO(lead.nextFollowUp);
    return isToday(followUpDate) || isTomorrow(followUpDate) || (isPast(followUpDate) && lead.status !== "won" && lead.status !== "lost");
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {upcomingFollowUps.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-white text-xs">
              {upcomingFollowUps.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upcoming Follow-ups</h3>
          {upcomingFollowUps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming follow-ups</p>
          ) : (
            <div className="space-y-3">
              {upcomingFollowUps.map((lead) => {
                const followUpDate = parseISO(lead.nextFollowUp);
                const isOverdue = isPast(followUpDate) && !isToday(followUpDate);
                
                return (
                  <div key={lead.id} className="p-3 border rounded-lg bg-card/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.organization}</p>
                      </div>
                      <Badge variant={isOverdue ? "destructive" : "default"} className="text-xs">
                        {isOverdue ? "Overdue" : isToday(followUpDate) ? "Today" : "Tomorrow"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Follow-up: {format(followUpDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
