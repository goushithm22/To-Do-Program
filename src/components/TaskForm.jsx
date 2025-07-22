import { useState } from 'react';
import { Plus, StickyNote, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CategorySelector } from './TaskCategories';
import { PrioritySelector } from './TaskPriority';
import { TaskDatePicker } from './TaskDatePicker';

const TaskForm = ({ onAdd }) => {
  const [newTask, setNewTask] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        category,
        priority,
        dueDate,
        notes: notes.trim(),
        progress: 0
      };
      onAdd(task);
      
      // Reset form
      setNewTask('');
      setCategory(null);
      setPriority(null);
      setDueDate(null);
      setNotes('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <Card className="p-4 mb-6 shadow-soft">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="What needs to be done?"
            className="flex-1"
          />
          <Button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="px-4"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                Options
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Category
                  </label>
                  <CategorySelector value={category} onChange={setCategory} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Priority
                  </label>
                  <PrioritySelector value={priority} onChange={setPriority} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Due Date
                  </label>
                  <TaskDatePicker date={dueDate} onChange={setDueDate} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Notes
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="min-h-[60px] text-sm resize-none"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
};

export { TaskForm };