import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Check, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isDark, setIsDark] = useState(false);

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

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Simple Todo
            </h1>
            <p className="text-muted-foreground">
              {tasks.length > 0 && (
                `${completedCount} of ${tasks.length} tasks completed`
              )}
            </p>
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

        {/* Add Task Input */}
        <Card className="p-4 mb-6 shadow-soft">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
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
        </Card>

        {/* Tasks List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <Card className="p-8 text-center shadow-soft">
              <p className="text-muted-foreground">
                No tasks yet. Add one above to get started!
              </p>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "p-4 shadow-soft transition-all duration-200 hover:shadow-hover hover:bg-task-hover",
                  "border-task-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "p-1 h-8 w-8 rounded-full border-2",
                      task.completed && "bg-primary border-primary text-primary-foreground"
                    )}
                  >
                    {task.completed && <Check className="h-4 w-4" />}
                  </Button>
                  
                  <span
                    className={cn(
                      "flex-1 transition-colors duration-200",
                      task.completed && "line-through text-task-completed"
                    )}
                  >
                    {task.text}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            Click the circle to mark complete • Click the trash to delete
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;