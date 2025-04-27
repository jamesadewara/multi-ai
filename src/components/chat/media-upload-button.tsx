import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MediaUploadButtonProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
}

export function MediaUploadButton({ 
  onFileSelect, 
  acceptedTypes = "image/*,video/*",
  multiple = true
}: MediaUploadButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFileSelect(files);
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) onFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
      className={cn(
        "relative",
        isDragging && "after:absolute after:inset-0 after:rounded-md after:border-2 after:border-dashed after:border-primary"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
      />
      <Button 
        variant="ghost" 
        size="icon"
        type="button"
        className="h-9 w-9"
        onClick={handleButtonClick}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
}