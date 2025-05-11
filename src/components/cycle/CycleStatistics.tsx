
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useCycleTracker } from "@/hooks/useCycleTracker";
import { format } from "date-fns";

export const CycleStatistics = () => {
  const { getCycleStatistics } = useCycleTracker();
  const stats = getCycleStatistics();
  
  return (
    <Card hover className="gradient-border overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-herhealth-pink-light to-herhealth-purple-light/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-herhealth-pink-dark" />
            <CardTitle>Cycle Summary</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs hover:bg-white/20">
            History
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-herhealth-pink-light/50 to-herhealth-pink-light/10 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Current Cycle Day</p>
            <p className="text-3xl font-bold text-herhealth-pink-dark">
              {stats.currentCycleDay}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Next Period in</p>
            <p className="text-xl font-bold">
              {stats.daysUntilNextPeriod} days
            </p>
            <p className="text-xs text-gray-500">
              Estimated: {stats.nextPeriodDate ? format(stats.nextPeriodDate, 'MMM d, yyyy') : 'Calculating...'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Average Cycle Length</p>
            <p className="text-xl font-bold">{stats.averageCycleLength} days</p>
            <p className="text-xs text-gray-500">
              Based on {stats.cycleLengthHistory ? stats.cycleLengthHistory.length : 0} cycles
            </p>
          </div>
          
          <div className={`p-4 rounded-lg shadow-md ${getCyclePhaseStyle(stats.cyclePhase)}`}>
            <p className="text-sm font-medium">{getCyclePhaseText(stats.cyclePhase).title}</p>
            <p className="text-lg font-bold">{getCyclePhaseText(stats.cyclePhase).phase}</p>
            <p className="text-xs">{getCyclePhaseText(stats.cyclePhase).description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getCyclePhaseStyle(phase: string) {
  switch(phase) {
    case 'menstrual':
      return 'bg-gradient-to-r from-herhealth-pink-light to-herhealth-pink-light/50 text-herhealth-pink-dark';
    case 'follicular':
      return 'bg-gradient-to-r from-herhealth-purple-light to-herhealth-purple-light/50 text-herhealth-purple-dark';
    case 'ovulation':
      return 'bg-gradient-to-r from-herhealth-blue-light to-herhealth-blue-light/50 text-herhealth-blue-dark';
    case 'luteal':
      return 'bg-gradient-to-r from-herhealth-peach-light to-herhealth-peach-light/50 text-herhealth-peach-dark';
    default:
      return 'bg-gradient-to-r from-herhealth-blue-light to-herhealth-blue-light/50 text-herhealth-blue-dark';
  }
}

function getCyclePhaseText(phase: string) {
  switch(phase) {
    case 'menstrual':
      return {
        title: 'Current Phase',
        phase: 'Menstrual',
        description: 'Your period is happening now'
      };
    case 'follicular':
      return {
        title: 'Current Phase',
        phase: 'Follicular',
        description: 'Your body is preparing to ovulate'
      };
    case 'ovulation':
      return {
        title: 'Current Phase',
        phase: 'Ovulation',
        description: 'Fertile window active'
      };
    case 'luteal':
      return {
        title: 'Current Phase',
        phase: 'Luteal',
        description: 'Post-ovulation phase'
      };
    default:
      return {
        title: 'Current Phase',
        phase: 'Calculating',
        description: 'Log more cycles for accurate predictions'
      };
  }
}
