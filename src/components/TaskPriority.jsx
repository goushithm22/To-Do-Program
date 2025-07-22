import { Badge } from '@/components/ui/badge';

const PRIORITIES = [
  { id: 'high', name: 'High', color: 'hsl(var(--priority-high))' },
  { id: 'medium', name: 'Medium', color: 'hsl(var(--priority-medium))' },
  { id: 'low', name: 'Low', color: 'hsl(var(--priority-low))' },
];

const PriorityBadge = ({ priority, onClick, isSelected = false }) => {
  const priorityData = PRIORITIES.find(p => p.id === priority);
  if (!priorityData) return null;

  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
      style={{ 
        backgroundColor: isSelected ? priorityData.color : undefined,
        borderColor: priorityData.color,
        color: isSelected ? 'white' : priorityData.color
      }}
      onClick={() => onClick && onClick(priority)}
    >
      {priorityData.name}
    </Badge>
  );
};

const PrioritySelector = ({ value, onChange }) => {
  return (
    <div className="flex gap-1">
      {PRIORITIES.map((priority) => (
        <PriorityBadge
          key={priority.id}
          priority={priority.id}
          isSelected={value === priority.id}
          onClick={(p) => onChange(value === p ? null : p)}
        />
      ))}
    </div>
  );
};

export { PRIORITIES, PriorityBadge, PrioritySelector };