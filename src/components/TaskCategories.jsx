import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'hsl(var(--category-work))' },
  { id: 'personal', name: 'Personal', color: 'hsl(var(--category-personal))' },
  { id: 'shopping', name: 'Shopping', color: 'hsl(var(--category-shopping))' },
  { id: 'health', name: 'Health', color: 'hsl(var(--category-health))' },
];

const CategoryBadge = ({ category, onClick, isSelected = false }) => {
  const categoryData = CATEGORIES.find(cat => cat.id === category);
  if (!categoryData) return null;

  return (
    <Badge
      variant={isSelected ? 'default' : 'secondary'}
      className="cursor-pointer hover:opacity-80 transition-opacity"
      style={{ 
        backgroundColor: isSelected ? categoryData.color : undefined,
        borderColor: categoryData.color,
        color: isSelected ? 'white' : categoryData.color
      }}
      onClick={() => onClick && onClick(category)}
    >
      {categoryData.name}
    </Badge>
  );
};

const CategorySelector = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <CategoryBadge
          key={category.id}
          category={category.id}
          isSelected={value === category.id}
          onClick={(cat) => onChange(value === cat ? null : cat)}
        />
      ))}
    </div>
  );
};

export { CATEGORIES, CategoryBadge, CategorySelector };