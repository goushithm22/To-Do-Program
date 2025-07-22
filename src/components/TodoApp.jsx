import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Moon, Sun, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';
import { TaskProgress } from './TaskProgress';

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
      task.id === id ? { ...task, completed: !task.completed } : task
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
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'completed' && task.completed) ||
                           (statusFilter === 'pending' && !task.completed);
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

  const completedCount = tasks.filter(task => task.completed).length;
  const totalProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Enhanced Todo
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                {tasks.length > 0 && (
                  `${completedCount} of ${tasks.length} tasks completed`
                )}
              </p>
              {tasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <TaskProgress 
                    progress={totalProgress} 
                    onChange={() => {}} 
                    disabled 
                  />
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center shadow-soft">
              <p className="text-muted-foreground">
                {tasks.length === 0 
                  ? "No tasks yet. Add one above to get started!"
                  : "No tasks match your current filters."
                }
              </p>
            </Card>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
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
                            className="relative"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing z-10"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="pl-8">
                              <TaskItem
                                task={task}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                                onUpdate={updateTask}
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
        {tasks.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            Drag tasks to reorder • Click options when adding tasks for more features
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;