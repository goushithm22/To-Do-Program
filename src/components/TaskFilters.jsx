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
              className="h-10 px-4 border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 text-xs animate-pulse">
                  {[statusFilter !== 'all', categoryFilter, priorityFilter].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 border-2 shadow-xl backdrop-blur-sm bg-card/95" align="end">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-lg">Filters</h4>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-3 text-xs font-medium hover:bg-destructive/10 hover:text-destructive"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', name: 'All' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'progress', name: 'In Progress' },
                    { id: 'completed', name: 'Completed' }
                  ].map((status) => (
                    <Button
                      key={status.id}
                      variant={statusFilter === status.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onStatusFilterChange(status.id)}
                      className="text-xs font-medium transition-all duration-200 hover:scale-105"
                    >
                      {status.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Category
                </label>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <CategorySelector value={categoryFilter} onChange={onCategoryFilterChange} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Priority
                </label>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <PrioritySelector value={priorityFilter} onChange={onPriorityFilterChange} />
                </div>
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