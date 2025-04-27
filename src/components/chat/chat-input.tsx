import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon, SendIcon, XIcon, ImageIcon, VideoIcon, AudioWaveform, FileIcon } from "lucide-react";
import { useChat } from "@/contexts/chat-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChatInput({ isLoading }: { isLoading: boolean }) {
  const { sendMessage, maxFileSize, optimizeMediaUploads, setOptimizeMediaUploads } = useChat();
  const [message, setMessage] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const GB = 1024 * 1024 * 1024;

    if (totalSize > maxFileSize) {
      toast.error('Total size exceeds limit', {
        description: `Selected files total ${(totalSize / GB).toFixed(2)}GB (max ${(maxFileSize / GB).toFixed(2)}GB)`
      });
      return;
    }

    if (files.length > 10) {
      toast.error('Too many files', {
        description: 'Maximum 10 files can be uploaded at once'
      });
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || 
                         file.type.startsWith('video/') || 
                         file.type.startsWith('audio/') ||
                         file.type.startsWith('application/');
      
      if (!isValidType) {
        toast.warning('Unsupported file type', {
          description: `${file.name} (${file.type})`
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles]);
      // toast.success(`Added ${validFiles.length} file(s)`);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && mediaFiles.length === 0) {
      toast.warning('Message is empty');
      return;
    }

    try {
      await sendMessage(message, mediaFiles);
      setMessage("");
      setMediaFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {mediaFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
          {mediaFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-background px-3 py-1 rounded-full text-sm">
              {file.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 flex-shrink-0" />
              ) : file.type.startsWith('video/') ? (
                <VideoIcon className="h-4 w-4 flex-shrink-0" />
              ) : file.type.startsWith('audio/') ? (
                <AudioWaveform className="h-4 w-4 flex-shrink-0" />
              ) : (
                <FileIcon className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={cn(
              "resize-none pr-20 min-h-[80px]",
              "focus-visible:ring-2 focus-visible:ring-primary"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              accept="image/*,video/*,audio/*,application/*"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8"
              disabled={isLoading || (!message.trim() && mediaFiles.length === 0)}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          {mediaFiles.length > 0 && (
            <span>
              {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} attached •{' '}
            </span>
          )}
          <span>Max {Math.round(maxFileSize / (1024 * 1024))}MB per file</span>
        </div>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={optimizeMediaUploads}
            onChange={(e) => setOptimizeMediaUploads(e.target.checked)}
            className="h-3 w-3"
          />
          Optimize large uploads
        </label>
      </div>
    </form>
  );
}