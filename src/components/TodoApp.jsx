import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, GripVertical, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Check for dark mode preference
    const darkMode = localStorage.getItem('todo-dark-mode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('todo-dark-mode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'pending'
      } : task
    ));
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === id ? updatedTask : task
    ));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the tasks array with new order
    const newTasks = [...tasks];
    items.forEach((item, index) => {
      const taskIndex = newTasks.findIndex(t => t.id === item.id);
      if (taskIndex !== -1) {
        newTasks[taskIndex] = { ...item, order: index };
      }
    });

    setTasks(newTasks);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const taskStatus = task.status || 'pending';
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'completed' && taskStatus === 'completed') ||
                           (statusFilter === 'pending' && taskStatus !== 'completed');
      
      const matchesCategory = !categoryFilter || task.category === categoryFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by order if available, otherwise by creation date
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'progress').length;
  const pendingTasks = tasks.filter(task => (task.status || 'pending') === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background transition-all duration-500">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              ProTask Manager
            </h1>
            {totalTasks > 0 && (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {completionRate}% Complete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-status-completed/10 border-status-completed/30 text-status-completed">
                    {completedTasks} Done
                  </Badge>
                  <Badge variant="outline" className="bg-status-progress/10 border-status-progress/30 text-status-progress">
                    {inProgressTasks} In Progress
                  </Badge>
                  <Badge variant="outline" className="bg-status-pending/10 border-status-pending/30 text-status-pending">
                    {pendingTasks} Pending
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="p-3 border-2 hover:border-primary/50 transition-all duration-200 hover:scale-105"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Add Task Form */}
        <TaskForm onAdd={addTask} />

        {/* Filters */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center shadow-elevated bg-gradient-card border-2 animate-fade-in">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {tasks.length === 0 ? "Ready to get productive?" : "No tasks match your filters"}
                  </h3>
                  <p className="text-muted-foreground">
                    {tasks.length === 0 
                      ? "Add your first task above and start organizing your work like a pro!"
                      : "Try adjusting your search criteria or clearing the filters."
                    }
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {filteredTasks.map((task, index) => (
                      <Draggable 
                        key={task.id.toString()} 
                        draggableId={task.id.toString()} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative group"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className={cn(
                                "absolute left-3 top-6 text-muted-foreground/60 hover:text-muted-foreground cursor-grab active:cursor-grabbing z-10 transition-all duration-200",
                                "opacity-0 group-hover:opacity-100 hover:scale-110"
                              )}
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="pl-10">
                              <TaskItem
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                                onUpdate={updateTask}
                                allTasks={tasks}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Footer */}
        {totalTasks > 0 && (
          <div className="text-center mt-12 space-y-2 animate-fade-in">
            <div className="text-sm text-muted-foreground">
              💡 <strong>Pro tip:</strong> Drag tasks to reorder • Use advanced options for power features
            </div>
            {completionRate === 100 && (
              <div className="text-lg font-semibold text-primary animate-glow">
                🎉 Congratulations! All tasks completed!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;