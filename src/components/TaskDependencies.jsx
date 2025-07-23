import { useState } from 'react';
import { Link, Unlink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const TaskDependencies = ({ task, allTasks, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const dependencies = task.dependencies || [];
  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !dependencies.includes(t.id) &&
    !(t.dependencies || []).includes(task.id) // Prevent circular dependencies
  );

  const addDependency = (taskId) => {
    const newDependencies = [...dependencies, taskId];
    onUpdate({ dependencies: newDependencies });
  };

  const removeDependency = (taskId) => {
    const newDependencies = dependencies.filter(id => id !== taskId);
    onUpdate({ dependencies: newDependencies });
  };

  const getDependentTask = (taskId) => {
    return allTasks.find(t => t.id === taskId);
  };

  const getBlockingDependencies = () => {
    return dependencies
      .map(id => getDependentTask(id))
      .filter(t => t && t.status !== 'completed');
  };

  const blockingDeps = getBlockingDependencies();
  const hasBlockingDeps = blockingDeps.length > 0;

  return (
    <Card className={cn(
      "p-3 border-2 animate-fade-in transition-all duration-200",
      hasBlockingDeps && "border-warning/50 bg-warning/5"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Dependencies</span>
              {dependencies.length > 0 && (
                <Badge variant="secondary" className="h-5 px-2 text-xs">
                  {dependencies.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 space-y-3">
            {hasBlockingDeps && (
              <div className="p-2 bg-warning/10 border border-warning/30 rounded-md">
                <p className="text-xs text-warning-foreground font-medium mb-1">
                  ⚠️ Blocked by incomplete dependencies:
                </p>
                <div className="space-y-1">
                  {blockingDeps.map(dep => (
                    <div key={dep.id} className="text-xs text-muted-foreground">
                      • {dep.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dependencies.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  This task depends on:
                </label>
                <div className="space-y-1">
                  {dependencies.map(depId => {
                    const depTask = getDependentTask(depId);
                    if (!depTask) return null;
                    
                    return (
                      <div key={depId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            depTask.status === 'completed' ? "bg-success" : "bg-warning"
                          )} />
                          <span className="text-xs">{depTask.text}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDependency(depId)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Unlink className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {availableTasks.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Add dependency:
                </label>
                <Select onValueChange={addDependency}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select a task..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks.map(t => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            t.status === 'completed' ? "bg-success" : 
                            t.status === 'progress' ? "bg-primary" : "bg-muted-foreground"
                          )} />
                          {t.text}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export { TaskDependencies };