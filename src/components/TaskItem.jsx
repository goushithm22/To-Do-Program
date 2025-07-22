import { useState } from 'react';
import { Check, Trash2, ChevronDown, ChevronRight, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CategoryBadge } from './TaskCategories';
import { PriorityBadge } from './TaskPriority';
import { TaskDatePicker } from './TaskDatePicker';
import { TaskProgress } from './TaskProgress';
import { cn } from '@/lib/utils';

const TaskItem = ({ 
  task, 
  onToggle, 
  onDelete, 
  onUpdate,
  isDragging = false,
  dragHandleProps 
}) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const updateTask = (updates) => {
    onUpdate(task.id, { ...task, ...updates });
  };

  const updateNotes = (notes) => {
    updateTask({ notes });
  };

  return (
    <Card
      className={cn(
        "p-4 shadow-soft transition-all duration-200 hover:shadow-hover hover:bg-task-hover border-task-border",
        isDragging && "opacity-50 rotate-2 scale-105"
      )}
      {...dragHandleProps}
    >
      <div className="space-y-3">
        {/* Main task row */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggle(task.id)}
            className={cn(
              "p-1 h-8 w-8 rounded-full border-2",
              task.completed && "bg-primary border-primary text-primary-foreground"
            )}
          >
            {task.completed && <Check className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "block transition-colors duration-200",
                task.completed && "line-through text-task-completed"
              )}
            >
              {task.text}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {task.notes && (
              <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <StickyNote className="h-3 w-3" />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="p-1 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task metadata */}
        <div className="flex flex-wrap items-center gap-2 ml-11">
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
        </div>

        {/* Progress bar */}
        {!task.completed && task.progress > 0 && (
          <div className="ml-11">
            <TaskProgress
              progress={task.progress}
              onChange={(progress) => updateTask({ progress })}
            />
          </div>
        )}

        {/* Notes section */}
        {task.notes && (
          <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
            <CollapsibleContent className="ml-11">
              <div className="pt-2 border-t border-border">
                <Textarea
                  value={task.notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[60px] text-sm resize-none"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </Card>
  );
};

export { TaskItem };