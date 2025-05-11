
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { useCycleTracker } from "@/hooks/useCycleTracker";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export const CycleCalendarVisualization = () => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { cycles, isLoadingCycles } = useCycleTracker();

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getCycleStatus = (date: Date) => {
    if (isLoadingCycles) return null;

    // Check if this date is in any cycle
    const dateStr = format(date, 'yyyy-MM-dd');
    const cycleOnThisDate = cycles.find(cycle => {
      const cycleDate = format(new Date(cycle.startDate), 'yyyy-MM-dd');
      
      // Additional logic to check for days after the cycle start (period duration)
      const cycleStartDate = new Date(cycle.startDate);
      const fiveDaysAfter = new Date(cycleStartDate);
      fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 5); // Assuming 5 day period
      
      return (
        dateStr === cycleDate ||
        (date >= cycleStartDate && date <= fiveDaysAfter)
      );
    });

    if (cycleOnThisDate) {
      return {
        isCycle: true,
        intensity: cycleOnThisDate.flowIntensity,
        isFirstDay: format(new Date(cycleOnThisDate.startDate), 'yyyy-MM-dd') === dateStr
      };
    }

    return null;
  };

  return (
    <Card hover className="w-full glass-effect border-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-herhealth-pink-light/70 to-herhealth-purple-light/30 pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-herhealth-pink-dark" />
          <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs font-medium py-2 text-gray-600 dark:text-gray-300">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10 rounded-md"></div>
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map(day => {
            const cycleStatus = getCycleStatus(day);
            
            return (
              <div 
                key={day.toString()}
                className={cn(
                  "h-10 rounded-md flex items-center justify-center text-sm relative",
                  !isSameMonth(day, currentMonth) && "text-gray-300",
                  isToday(day) && "border-2 border-herhealth-blue-dark"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all hover:scale-110",
                    cycleStatus?.isCycle && "bg-herhealth-pink shadow-sm text-white",
                    cycleStatus?.isFirstDay && "ring-2 ring-herhealth-pink-dark",
                    cycleStatus?.intensity === "heavy" && "bg-gradient-to-br from-herhealth-pink-dark to-herhealth-pink text-white shadow-md",
                    cycleStatus?.intensity === "medium" && "bg-herhealth-pink text-white shadow-sm",
                    cycleStatus?.intensity === "light" && "bg-herhealth-pink-light text-herhealth-pink-dark",
                    cycleStatus?.intensity === "spotting" && "bg-herhealth-pink-light/50 text-herhealth-pink-dark"
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center p-3 bg-white/60 dark:bg-black/30 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-herhealth-pink-dark to-herhealth-pink shadow-sm"></div>
            <span className="text-xs">Heavy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-herhealth-pink shadow-sm"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-herhealth-pink-light"></div>
            <span className="text-xs">Light</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-herhealth-pink-light/50"></div>
            <span className="text-xs">Spotting</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
