import { useState } from 'react';
import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CategorySelector } from './TaskCategories';
import { PrioritySelector } from './TaskPriority';
import { TaskDatePicker } from './TaskDatePicker';
import { TaskLabelSelector } from './TaskLabels';
import { cn } from '@/lib/utils';

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [labels, setLabels] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text: text.trim(),
      status: 'pending',
      completed: false,
      category,
      priority,
      dueDate,
      notes: notes.trim() || null,
      labels: labels.length > 0 ? labels : null,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
      actualTime: 0,
      dependencies: [],
      attachments: [],
      createdAt: new Date().toISOString(),
    };

    onAdd(newTask);
    
    // Reset form
    setText('');
    setCategory(null);
    setPriority(null);
    setDueDate(null);
    setNotes('');
    setLabels([]);
    setEstimatedTime('');
    setIsAdvancedOpen(false);
  };

  const hasAdvancedOptions = category || priority || dueDate || notes || labels.length > 0 || estimatedTime;

  return (
    <Card className="p-4 mb-6 shadow-elevated border-2 bg-gradient-card animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!text.trim()}
            className={cn(
              "h-12 px-4 transition-all duration-200 shadow-md hover:shadow-lg",
              !text.trim() ? "opacity-50" : "hover:scale-105"
            )}
          >
            <Plus className="h-5 w-5 mr-1" />
            Add
          </Button>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "w-full justify-between h-10 transition-all duration-200",
                hasAdvancedOptions && "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Advanced Options</span>
                {hasAdvancedOptions && (
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="pt-4 space-y-4 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <CategorySelector value={category} onChange={setCategory} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <PrioritySelector value={priority} onChange={setPriority} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Labels</label>
                <TaskLabelSelector selectedLabels={labels} onChange={setLabels} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Card>
  );
};

export { TaskForm };