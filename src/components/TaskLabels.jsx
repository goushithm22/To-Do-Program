import { AlertTriangle, Eye, Star, Clock4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TASK_LABELS = [
  {
    id: 'urgent',
    name: 'Urgent',
    icon: AlertTriangle,
    color: 'hsl(var(--label-urgent))',
    bgColor: 'hsl(var(--label-urgent) / 0.1)',
    borderColor: 'hsl(var(--label-urgent) / 0.3)'
  },
  {
    id: 'review',
    name: 'Review Needed',
    icon: Eye,
    color: 'hsl(var(--label-review))',
    bgColor: 'hsl(var(--label-review) / 0.1)',
    borderColor: 'hsl(var(--label-review) / 0.3)'
  },
  {
    id: 'important',
    name: 'Important',
    icon: Star,
    color: 'hsl(var(--label-important))',
    bgColor: 'hsl(var(--label-important) / 0.1)',
    borderColor: 'hsl(var(--label-important) / 0.3)'
  },
  {
    id: 'later',
    name: 'Later',
    icon: Clock4,
    color: 'hsl(var(--label-later))',
    bgColor: 'hsl(var(--label-later) / 0.1)',
    borderColor: 'hsl(var(--label-later) / 0.3)'
  }
];

const TaskLabelBadge = ({ label, onRemove }) => {
  const labelConfig = TASK_LABELS.find(l => l.id === label);
  if (!labelConfig) return null;

  const LabelIcon = labelConfig.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border animate-fade-in",
        onRemove && "pr-1"
      )}
      style={{
        color: labelConfig.color,
        backgroundColor: labelConfig.bgColor,
        borderColor: labelConfig.borderColor,
      }}
    >
      <LabelIcon className="h-3 w-3 mr-1" />
      {labelConfig.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-destructive transition-colors"
        >
          ×
        </button>
      )}
    </Badge>
  );
};

const TaskLabelSelector = ({ selectedLabels = [], onChange }) => {
  const toggleLabel = (labelId) => {
    const newLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    onChange(newLabels);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {TASK_LABELS.map((label) => {
          const isSelected = selectedLabels.includes(label.id);
          return (
            <Button
              key={label.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLabel(label.id)}
              className={cn(
                "text-xs font-medium transition-all duration-200 hover:scale-105 justify-start",
                isSelected && "shadow-md"
              )}
              style={!isSelected ? {
                color: label.color,
                backgroundColor: label.bgColor,
                borderColor: label.borderColor,
              } : {}}
            >
              <label.icon className="h-3 w-3 mr-1" />
              {label.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export { TaskLabelBadge, TaskLabelSelector, TASK_LABELS };