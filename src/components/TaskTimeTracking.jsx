import { useState } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const TaskTimeTracking = ({ task, onUpdate }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStart, setTrackingStart] = useState(null);

  const estimatedTime = task.estimatedTime || 0;
  const actualTime = task.actualTime || 0;

  const startTracking = () => {
    setIsTracking(true);
    setTrackingStart(Date.now());
  };

  const stopTracking = () => {
    if (trackingStart) {
      const trackedMinutes = Math.round((Date.now() - trackingStart) / 1000 / 60);
      onUpdate({ actualTime: actualTime + trackedMinutes });
    }
    setIsTracking(false);
    setTrackingStart(null);
  };

  const resetTime = () => {
    onUpdate({ actualTime: 0 });
    setIsTracking(false);
    setTrackingStart(null);
  };

  const updateEstimatedTime = (time) => {
    onUpdate({ estimatedTime: parseInt(time) || 0 });
  };

  const isOverTime = actualTime > estimatedTime && estimatedTime > 0;
  const progressPercentage = estimatedTime > 0 ? Math.min((actualTime / estimatedTime) * 100, 100) : 0;

  return (
    <Card className="p-3 bg-gradient-card border-2 animate-fade-in">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Time Tracking</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={isTracking ? "destructive" : "default"}
              size="sm"
              onClick={isTracking ? stopTracking : startTracking}
              className={cn(
                "h-7 px-2 text-xs transition-all duration-200",
                isTracking && "animate-glow"
              )}
            >
              {isTracking ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            {actualTime > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTime}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Estimated</label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={estimatedTime || ''}
                onChange={(e) => updateEstimatedTime(e.target.value)}
                placeholder="0"
                className="h-7 text-xs"
                min="0"
              />
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Actual</label>
            <Badge
              variant="outline"
              className={cn(
                "h-7 px-2 font-medium justify-center w-full",
                isOverTime && "border-destructive text-destructive"
              )}
            >
              {formatTime(actualTime)}
            </Badge>
          </div>
        </div>

        {estimatedTime > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className={cn(isOverTime && "text-destructive")}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  isOverTime ? "bg-destructive" : "bg-primary"
                )}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {isTracking && (
          <div className="text-center">
            <Badge variant="default" className="animate-pulse">
              <Play className="h-3 w-3 mr-1" />
              Tracking time...
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export { TaskTimeTracking, formatTime };