import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLeads } from "@/contexts/LeadsContext";
import { format, parseISO, isTomorrow, isToday, isPast } from "date-fns";

const Notifications = () => {
  const { leads } = useLeads();
  const [checkedNotifications, setCheckedNotifications] = useState<Set<string>>(new Set());

  const upcomingFollowUps = leads.filter(lead => {
    try {
      const followUpDate = parseISO(lead.nextFollowUp);
      return (isToday(followUpDate) || isTomorrow(followUpDate) || (isPast(followUpDate) && !isToday(followUpDate))) && 
             lead.status !== "won" && 
             lead.status !== "lost";
    } catch (error) {
      return false;
    }
  });

  const handleCheckToggle = (leadId: string) => {
    setCheckedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {upcomingFollowUps.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              {upcomingFollowUps.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-4" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Upcoming Follow-ups</h3>
          {upcomingFollowUps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming follow-ups</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {upcomingFollowUps.map((lead) => {
                const followUpDate = parseISO(lead.nextFollowUp);
                const isOverdue = isPast(followUpDate) && !isToday(followUpDate);
                const isChecked = checkedNotifications.has(lead.id);
                
                return (
                  <div key={lead.id} className={`p-3 border rounded-lg bg-card/50 hover:bg-accent/50 transition-colors ${isChecked ? "opacity-50 bg-accent/30" : ""}`}>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleCheckToggle(lead.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${isChecked ? "line-through" : ""}`}>{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.organization}</p>
                          </div>
                          <Badge variant={isOverdue ? "destructive" : "default"} className="text-xs ml-2">
                            {isOverdue ? "Overdue" : isToday(followUpDate) ? "Today" : "Tomorrow"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Follow-up: {format(followUpDate, "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
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
