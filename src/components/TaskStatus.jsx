import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TASK_STATUSES = [
  {
    id: 'pending',
    name: 'Pending',
    icon: Circle,
    color: 'hsl(var(--status-pending))',
    bgColor: 'hsl(var(--status-pending) / 0.1)',
    borderColor: 'hsl(var(--status-pending) / 0.3)'
  },
  {
    id: 'progress',
    name: 'In Progress',
    icon: Clock,
    color: 'hsl(var(--status-progress))',
    bgColor: 'hsl(var(--status-progress) / 0.1)',
    borderColor: 'hsl(var(--status-progress) / 0.3)'
  },
  {
    id: 'completed',
    name: 'Completed',
    icon: CheckCircle2,
    color: 'hsl(var(--status-completed))',
    bgColor: 'hsl(var(--status-completed) / 0.1)',
    borderColor: 'hsl(var(--status-completed) / 0.3)'
  }
];

const TaskStatusBadge = ({ status, onClick, className }) => {
  const statusConfig = TASK_STATUSES.find(s => s.id === status) || TASK_STATUSES[0];
  const StatusIcon = statusConfig.icon;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-7 px-2 text-xs font-medium transition-all duration-200 hover:scale-105",
        "border-2 hover:shadow-md",
        className
      )}
      style={{
        color: statusConfig.color,
        backgroundColor: statusConfig.bgColor,
        borderColor: statusConfig.borderColor,
      }}
    >
      <StatusIcon className="h-3 w-3 mr-1" />
      {statusConfig.name}
    </Button>
  );
};

const TaskStatusSelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {TASK_STATUSES.map((status) => (
        <Button
          key={status.id}
          variant={value === status.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(status.id)}
          className={cn(
            "text-xs font-medium transition-all duration-200 hover:scale-105",
            value === status.id && "shadow-md"
          )}
          style={value === status.id ? {} : {
            color: status.color,
            backgroundColor: status.bgColor,
            borderColor: status.borderColor,
          }}
        >
          <status.icon className="h-3 w-3 mr-1" />
          {status.name}
        </Button>
      ))}
    </div>
  );
};

export { TaskStatusBadge, TaskStatusSelector, TASK_STATUSES };