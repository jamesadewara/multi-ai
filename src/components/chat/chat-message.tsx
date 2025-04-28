import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AIModel, MediaReference } from "@/types/chat";
import { FileIcon, ImageIcon, VideoIcon, CopyIcon, TrashIcon, PencilIcon, MoreVerticalIcon, DownloadIcon, AudioWaveform } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { mediaCacheService } from "@/lib/media-cache-service";
import { useChat } from "@/contexts/chat-context";

export interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant" | "system";
    timestamp: Date;
    media?: MediaReference[]; // Updated to use MediaReference
  };
  aiModel?: AIModel;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
  maxFileSize?: number;
  getMediaDataUrl?: (mediaRef: MediaReference) => Promise<string>;
}

export function ChatMessage({
  message,
  aiModel,
  isLoading = false,
  onDelete,
  onEdit,
  maxFileSize = 1024 * 1024 * 1024, // Default 1GB if not provided
}: ChatMessageProps) {
  
   const { getMediaDataUrl} = useChat();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [mediaLoadErrors, setMediaLoadErrors] = useState<Record<number, boolean>>({});
  const [mediaDataUrls, setMediaDataUrls] = useState<Record<string, string>>({});
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";

  // Scroll into view when message is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message.content]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    console.log("DEBUG", { message, media: message?.media, getMediaDataUrl });

    if (!message?.media || !getMediaDataUrl) {
      console.warn("getMediaDataUrl function not provided or no media to load.");
      return;
    }

    console.log("demo");

    const loadMediaData = async () => {
      if (!message.media || message.media.length === 0) return;

      const mediaMap: Record<string, string> = {};
      const loadingMap: Record<string, boolean> = {};

      await Promise.all(
        message.media.map(async (mediaRef) => {
          if (!mediaRef?.id) return;
          loadingMap[mediaRef.id] = true;
          try {
            const dataUrl = await getMediaDataUrl!(mediaRef);
            mediaMap[mediaRef.id] = dataUrl;
          } catch (error) {
            console.error(`Failed to load media ${mediaRef.id}:`, error);
          } finally {
            loadingMap[mediaRef.id] = false;
          }
        })
      );

      setMediaDataUrls(mediaMap);
      setLoadingMedia(loadingMap);
    };

    loadMediaData();
  }, [message, getMediaDataUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsMenuOpen(false);
    toast.success('Message copied to clipboard');
  };

  const handleEdit = () => {
    setEditedContent(message.content);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = () => {
    if (onEdit && editedContent.trim() && editedContent !== message.content) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setIsMenuOpen(false);
  };

  const downloadFile = async (mediaRef: MediaReference) => {
    try {
      if (!getMediaDataUrl) {
        toast.error(`Cannot download ${mediaRef.name}: Media service unavailable`);
        return;
      }

      const dataUrl = await getMediaDataUrl(mediaRef);
      if (!dataUrl) {
        toast.error(`Cannot download ${mediaRef.name}: Data not available`);
        return;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = mediaRef.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.info(`Downloading ${mediaRef.name}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${mediaRef.name}`);
    }
  };

  const handleMediaClick = async (mediaRef: MediaReference) => {
    if (!getMediaDataUrl) {
      toast.error(`Cannot open ${mediaRef.name}: Media service unavailable`);
      return;
    }

    try {
      const dataUrl = await getMediaDataUrl(mediaRef);
      if (!dataUrl) {
        toast.error(`Cannot open ${mediaRef.name}: Data not available`);
        return;
      }

      // For unsupported types (PDF, etc.), download directly
      if (!mediaRef.type.startsWith('image/') &&
        !mediaRef.type.startsWith('video/') &&
        !mediaRef.type.startsWith('audio/')) {
        downloadFile(mediaRef);
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${mediaRef.name}</title>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
            .media-container { max-width: 90vw; max-height: 90vh; text-align: center; }
            img, video { max-width: 100%; max-height: 80vh; object-fit: contain; }
            audio { width: 80%; margin: 20px 0; }
            .filename { margin-top: 10px; font-family: sans-serif; color: #333; }
            .download-btn { 
              margin-top: 15px; 
              padding: 8px 16px;
              background: brown;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            .error-msg {
              color: #e53e3e;
              margin: 10px 0;
              font-family: sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="media-container">
            ${mediaRef.type.startsWith('image/') ?
          `<img src="${dataUrl}" alt="${mediaRef.name}" onerror="showError()" />` :
          mediaRef.type.startsWith('video/') ?
            `<video src="${dataUrl}" controls autoplay onerror="showError()"></video>` :
            mediaRef.type.startsWith('audio/') ?
              `<audio src="${dataUrl}" controls autoplay onerror="showError()"></audio>` : ''}
            <div class="filename">${mediaRef.name}</div>
            <div id="error-container" style="display: none;">
              <div class="error-msg">Failed to load media. Try downloading instead.</div>
            </div>
            <button class="download-btn" onclick="window.downloadFile()">Download</button>
          </div>
          <script>
            function showError() {
              document.getElementById('error-container').style.display = 'block';
            }
            
            window.downloadFile = function() {
              const a = document.createElement('a');
              a.href = '${dataUrl}';
              a.download = '${mediaRef.name}';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const viewer = window.open(url, '_blank');
      if (!viewer) {
        downloadFile(mediaRef);
      }
    } catch (error) {
      console.error('Error opening media:', error);
      downloadFile(mediaRef);
    }
  };

  const handleMediaError = (mediaRef: MediaReference) => {
    setMediaLoadErrors(prev => ({ ...prev, [mediaRef.id]: true }));
    toast.error(`Failed to load media: ${mediaRef.name}`, {
      action: {
        label: 'Download',
        onClick: () => downloadFile(mediaRef)
      }
    });
  };

  const renderMedia = () => {
    if (!message.media || message.media.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {message.media.map((mediaRef, index) => {
          // Safety check for invalid items
          if (!mediaRef || !mediaRef.type || !mediaRef.id) {
            console.error("Invalid media reference:", mediaRef);
            return null;
          }

          const isImage = mediaRef.type.startsWith('image/');
          const isVideo = mediaRef.type.startsWith('video/');
          const isAudio = mediaRef.type.startsWith('audio/');
          const hasError = mediaLoadErrors[mediaRef.id];
          const isLoading = loadingMedia[mediaRef.id];
          const dataUrl = mediaDataUrls[mediaRef.id];

          // Show loading indicator if media is still loading
          if (isLoading) {
            return (
              <div key={mediaRef.id} className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-current animate-blink"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-blink [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-blink [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs">{mediaRef.name}</span>
              </div>
            );
          }

          // If dataUrl is available and no error, show media preview
          if (dataUrl && !hasError && (isImage || isVideo || isAudio)) {
            return (
              <div key={mediaRef.id} className="relative rounded-md overflow-hidden border">
                {isImage ? (
                  <img
                    src={dataUrl}
                    alt={mediaRef.name}
                    className="max-w-[200px] max-h-[200px] object-contain bg-muted/50 cursor-pointer"
                    onClick={() => handleMediaClick(mediaRef)}
                    onError={() => handleMediaError(mediaRef)}
                  />
                ) : isVideo ? (
                  <video
                    src={dataUrl}
                    controls
                    className="max-w-[200px] max-h-[200px] object-contain bg-muted/50 cursor-pointer"
                    onClick={(e) => {
                      if (!(e.target as HTMLVideoElement).controls) {
                        handleMediaClick(mediaRef);
                      }
                    }}
                    onError={() => handleMediaError(mediaRef)}
                  />
                ) : (
                  <div className="flex flex-col items-center p-2 bg-muted/30">
                    <AudioWaveform className="h-5 w-5 flex-shrink-0 mb-2" />
                    <audio
                      src={dataUrl}
                      controls
                      controlsList="nodownload" // Hide native download button
                      onError={() => handleMediaError(mediaRef)}
                      className="max-w-[200px] object-contain bg-muted/50"
                    />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1 text-xs truncate">
                  {mediaRef.name}
                </div>
              </div>
            );
          } else {
            // Fallback for non-viewable files or when there's an error
            return (
              <div
                key={mediaRef.id}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-md text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => downloadFile(mediaRef)}
              >
                {isImage ? (
                  <ImageIcon className="h-4 w-4" />
                ) : isVideo ? (
                  <VideoIcon className="h-4 w-4" />
                ) : isAudio ? (
                  <AudioWaveform className="h-4 w-4" />
                ) : (
                  <FileIcon className="h-4 w-4" />
                )}
                <span className="truncate max-w-[180px]">{mediaRef.name}</span>
                <DownloadIcon className="h-3 w-3 ml-auto text-muted-foreground" />
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-start gap-3 py-4 group relative",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      {isUser ? (
        <Avatar className="h-8 w-8 border bg-background">
          <AvatarFallback className="text-primary-foreground bg-primary">U</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={aiModel?.avatar} alt={aiModel?.name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {aiModel?.name.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] text-sm sm:text-base break-words relative",
          isUser
            ? "chat-bubble-user ml-auto"
            : "chat-bubble-ai"
        )}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('img, video, audio, a, button')) {
            setIsMenuOpen(!isMenuOpen);
          }
        }}
      >
        <button
          className={cn(
            "absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted/50",
            isUser ? "left-1" : "right-1"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className={cn(
              "absolute z-50 mt-1 w-40 rounded-md border bg-popover shadow-lg",
              isUser ? "left-0" : "right-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-1">
              <button
                className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy
              </button>
              {isUser && (
                <button
                  className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </button>
              )}
              <button
                className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-muted/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-current animate-blink"></div>
            <div className="h-2 w-2 rounded-full bg-current animate-blink [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 rounded-full bg-current animate-blink [animation-delay:0.4s]"></div>
          </div>
        ) : isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded bg-background text-foreground"
              rows={4}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                className="px-3 py-1 text-sm rounded border hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit();
                }}
                className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="prose dark:prose-invert max-w-none markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative">
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <button
                          className="absolute top-2 right-2 p-1 rounded bg-muted/50 hover:bg-muted transition-colors"
                          onClick={() => navigator.clipboard.writeText(String(children))}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: ({ node, ...props }) => (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-border" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-3 py-2 text-left text-xs font-medium bg-muted/50" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-3 py-2 whitespace-nowrap text-sm" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="pl-4 border-l-4 border-muted italic my-4" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {renderMedia()}
          </>
        )}
      </div>
    </div>
  );
}