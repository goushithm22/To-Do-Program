import { useState } from 'react';
import { format, isToday, isPast } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const TaskDatePicker = ({ date, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const clearDate = () => {
    onChange(null);
    setIsOpen(false);
  };

  const getDateDisplayClass = () => {
    if (!date) return '';
    if (isToday(date)) return 'text-blue-600 dark:text-blue-400';
    if (isPast(date)) return 'text-red-600 dark:text-red-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs justify-start font-normal",
            !date && "text-muted-foreground",
            getDateDisplayClass()
          )}
        >
          <CalendarIcon className="h-3 w-3 mr-1" />
          {date ? format(date, "MMM dd") : "Due date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="text-sm font-medium">Due Date</span>
          {date && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={clearDate}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onChange(selectedDate);
            setIsOpen(false);
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export { TaskDatePicker };