import { useState } from 'react';
import { ChevronDown, ChevronRight, StickyNote, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CategoryBadge } from './TaskCategories';
import { PriorityBadge } from './TaskPriority';
import { TaskDatePicker } from './TaskDatePicker';
import { TaskStatusBadge } from './TaskStatus';
import { TaskLabelBadge } from './TaskLabels';
import { TaskTimeTracking } from './TaskTimeTracking';
import { TaskDependencies } from './TaskDependencies';
import { TaskAttachments } from './TaskAttachments';
import { cn } from '@/lib/utils';

const TaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onUpdate,
  allTasks,
  isDragging = false,
  dragHandleProps 
}) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const updateTask = (updates) => {
    onUpdate(task.id, { ...task, ...updates });
  };

  const updateNotes = (notes) => {
    updateTask({ notes });
  };

  const cycleStatus = () => {
    const statusOrder = ['pending', 'progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status || 'pending');
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const newStatus = statusOrder[nextIndex];
    
    updateTask({ 
      status: newStatus,
      completed: newStatus === 'completed'
    });
  };

  const isCompleted = task.status === 'completed';
  const hasExtendedFeatures = task.labels?.length > 0 || 
                              task.estimatedTime > 0 || 
                              task.actualTime > 0 || 
                              task.dependencies?.length > 0 || 
                              task.attachments?.length > 0;

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-soft transition-all duration-300 hover:shadow-elevated border-2",
        "bg-gradient-card hover:scale-[1.01] animate-fade-in",
        isDragging && "opacity-60 rotate-1 scale-105 shadow-elevated"
      )}
      {...dragHandleProps}
    >
      <div className="p-4 space-y-4">
        {/* Main task row */}
        <div className="flex items-start gap-3">
          <TaskStatusBadge
            status={task.status || 'pending'}
            onClick={cycleStatus}
            className="mt-0.5 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "block font-medium leading-relaxed transition-all duration-200",
                  isCompleted && "line-through text-task-completed opacity-70"
                )}
              >
                {task.text}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-60 hover:opacity-100 flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
                    {isDetailsOpen ? 'Hide Details' : 'Show Details'}
                  </DropdownMenuItem>
                  {task.notes && (
                    <DropdownMenuItem onClick={() => setIsNotesOpen(!isNotesOpen)}>
                      {isNotesOpen ? 'Hide Notes' : 'Show Notes'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {task.category && (
                <CategoryBadge category={task.category} />
              )}
              
              {task.priority && (
                <PriorityBadge priority={task.priority} />
              )}
              
              {task.dueDate && (
                <TaskDatePicker
                  date={task.dueDate}
                  onChange={(date) => updateTask({ dueDate: date })}
                />
              )}

              {task.labels?.map(label => (
                <TaskLabelBadge
                  key={label}
                  label={label}
                  onRemove={() => {
                    const newLabels = task.labels.filter(l => l !== label);
                    updateTask({ labels: newLabels });
                  }}
                />
              ))}

              {task.notes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNotesOpen(!isNotesOpen)}
                  className={cn(
                    "h-6 w-6 p-0 rounded-full transition-all duration-200",
                    isNotesOpen ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <StickyNote className="h-3 w-3" />
                </Button>
              )}

              {hasExtendedFeatures && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className={cn(
                    "h-6 px-2 text-xs rounded-full transition-all duration-200",
                    isDetailsOpen ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ChevronRight className={cn(
                    "h-3 w-3 mr-1 transition-transform duration-200",
                    isDetailsOpen && "rotate-90"
                  )} />
                  Details
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notes section */}
        {task.notes && (
          <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
            <CollapsibleContent>
              <div className="pt-2 border-t border-border/50 animate-slide-up">
                <Textarea
                  value={task.notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[80px] text-sm resize-none border-0 bg-muted/30 focus:bg-muted/50 transition-colors"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Extended features */}
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleContent>
            <div className="pt-2 border-t border-border/50 space-y-3 animate-slide-up">
              <TaskTimeTracking
                task={task}
                onUpdate={updateTask}
              />
              
              <TaskDependencies
                task={task}
                allTasks={allTasks}
                onUpdate={updateTask}
              />
              
              <TaskAttachments
                task={task}
                onUpdate={updateTask}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};

export { TaskItem };