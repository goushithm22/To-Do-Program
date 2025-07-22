import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CategorySelector, CATEGORIES } from './TaskCategories';
import { PrioritySelector, PRIORITIES } from './TaskPriority';

const TaskFilters = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onCategoryFilterChange(null);
    onPriorityFilterChange(null);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter || priorityFilter;

  return (
    <Card className="p-4 mb-4 shadow-soft">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10"
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Status
                </label>
                <div className="flex gap-1">
                  {[
                    { id: 'all', name: 'All' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'completed', name: 'Completed' }
                  ].map((status) => (
                    <Button
                      key={status.id}
                      variant={statusFilter === status.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusFilterChange(status.id)}
                      className="text-xs"
                    >
                      {status.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Category
                </label>
                <CategorySelector value={categoryFilter} onChange={onCategoryFilterChange} />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Priority
                </label>
                <PrioritySelector value={priorityFilter} onChange={onPriorityFilterChange} />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-10 w-10 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {statusFilter !== 'all' && (
            <Badge variant="secondary">
              Status: {statusFilter}
              <button
                onClick={() => onStatusFilterChange('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {categoryFilter && (
            <Badge variant="secondary">
              Category: {CATEGORIES.find(c => c.id === categoryFilter)?.name}
              <button
                onClick={() => onCategoryFilterChange(null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priorityFilter && (
            <Badge variant="secondary">
              Priority: {PRIORITIES.find(p => p.id === priorityFilter)?.name}
              <button
                onClick={() => onPriorityFilterChange(null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

export { TaskFilters };