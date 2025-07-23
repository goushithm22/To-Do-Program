import { useState } from 'react';
import { Paperclip, File, Image, X, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  
  if (imageExtensions.includes(extension)) {
    return Image;
  }
  return File;
};

const getFileSize = () => {
  // Simulate file size since we're not actually uploading files
  return `${Math.floor(Math.random() * 500) + 50}KB`;
};

const TaskAttachments = ({ task, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const attachments = task.attachments || [];

  const addAttachment = () => {
    if (!newFileName.trim()) return;
    
    const newAttachment = {
      id: Date.now().toString(),
      name: newFileName.trim(),
      size: getFileSize(),
      type: getFileIcon(newFileName.trim()),
      addedAt: new Date().toISOString()
    };
    
    const newAttachments = [...attachments, newAttachment];
    onUpdate({ attachments: newAttachments });
    setNewFileName('');
  };

  const removeAttachment = (attachmentId) => {
    const newAttachments = attachments.filter(a => a.id !== attachmentId);
    onUpdate({ attachments: newAttachments });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addAttachment();
    }
  };

  return (
    <Card className="p-3 border-2 animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Attachments</span>
              {attachments.length > 0 && (
                <Badge variant="secondary" className="h-5 px-2 text-xs">
                  {attachments.length}
                </Badge>
              )}
            </div>
            <div className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-3 space-y-3">
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map(attachment => {
                  const FileIcon = attachment.type;
                  return (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                          title="Preview"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(attachment.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          title="Remove"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter filename (e.g., document.pdf, image.jpg)"
                className="h-8 text-xs flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addAttachment}
                disabled={!newFileName.trim()}
                className="h-8 px-3 text-xs whitespace-nowrap"
              >
                <Paperclip className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              💡 Tip: Add files like "presentation.pptx", "screenshot.png", or "notes.txt"
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export { TaskAttachments };