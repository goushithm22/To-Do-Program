import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

const TaskProgress = ({ progress = 0, onChange, disabled = false }) => {
  const adjustProgress = (amount) => {
    const newProgress = Math.max(0, Math.min(100, progress + amount));
    onChange(newProgress);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => adjustProgress(-10)}
        disabled={disabled || progress <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <div className="flex-1 flex items-center gap-2">
        <Progress value={progress} className="flex-1" />
        <span className="text-xs text-muted-foreground min-w-[3rem]">
          {progress}%
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => adjustProgress(10)}
        disabled={disabled || progress >= 100}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export { TaskProgress };