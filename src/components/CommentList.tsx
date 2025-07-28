import React, { useState, useRef } from "react";
import { Comment } from "../types";
import { Image, ImageOff, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImageModal from "./ImageModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import CommentItem from "./CommentItem";
import { getRepliesByComment } from "../api/commentService";

interface CommentListProps {
  comments: Comment[];
  onAddComment: (text: string, imageUrl?: string, parentId?: string) => void;
  onEditComment?: (commentId: string, text: string, imageUrl?: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDislikeComment?: (commentId: string) => void;
  expanded?: boolean;
  loading?: boolean;
  currentUserId?: string;
}

// Common emojis for quick access
const commonEmojis = [
  "😀",
  "😂",
  "😊",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "✨",
  "🎉",
  "👏",
  "🙏",
  "🤝",
  "💯",
  "⭐",
  "🌟",
  "💪",
];

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onDislikeComment,
  expanded = false,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [newCommentImage, setNewCommentImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const topLevelComments = comments.filter((c) => !c.parentId);
  const displayComments = expanded
    ? topLevelComments
    : topLevelComments.slice(0, 1);
  const isMobile = useIsMobile();

  // Get replies for each comment
  const commentsWithReplies = displayComments.map((comment) => {
    // Explicitly fetch replies for each comment
    const replies =
      comment.replies && comment.replies.length > 0
        ? getRepliesByComment(comment.id)
        : [];
    return { comment, replies };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() || newCommentImage) {
      onAddComment(newComment.trim(), newCommentImage || undefined);
      setNewComment("");
      setNewCommentImage(null);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete && onDeleteComment) {
      onDeleteComment(commentToDelete);
      setCommentToDelete(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bildestørrelsen må være mindre enn 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewCommentImage(base64String);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeImage = () => {
    setNewCommentImage(null);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const insertEmoji = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
    if (commentTextareaRef.current) {
      commentTextareaRef.current.focus();
    }
  };

  const handleReplyComment = (
    parentId: string,
    text: string,
    imageUrl?: string
  ) => {
    if (onAddComment) {
      onAddComment(text, imageUrl, parentId);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            ref={commentTextareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Legg til kommentar..."
            className="min-h-[100px] pr-10 resize-y"
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Legg til emoji"
              >
                <Smile size={20} />
              </button>
            </PopoverTrigger>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className=" absolute right-2 bottom-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Legg til bilde"
            >
              <Image size={20} />
            </button>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="grid grid-cols-5 gap-2">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="text-xl p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!newComment.trim() && !newCommentImage}
            className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] flex-shrink-0"
          >
            Kommenter
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {newCommentImage && (
          <div className="relative mt-2 inline-block">
            <img
              src={newCommentImage}
              alt="Comment attachment"
              className="max-h-40 rounded-md object-contain border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              title="Slett bilde"
            >
              <ImageOff size={14} />
            </button>
          </div>
        )}
      </form>

      <div className="space-y-3">
        {commentsWithReplies.map(({ comment, replies }) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={comments.filter((c) => c.parentId === comment.id)}
            onEditComment={onEditComment}
            onDeleteComment={handleDeleteClick}
            onLikeComment={onLikeComment}
            onDislikeComment={onDislikeComment}
            onReplyComment={handleReplyComment}
            onOpenImageModal={openImageModal}
            commonEmojis={commonEmojis}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      <ImageModal
        imageUrl={selectedImage}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      <AlertDialog
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Slett kommentar</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil slette denne kommentaren? Denne
              handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentList;
