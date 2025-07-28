import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentList from "./CommentList";
import { Comment } from "../types";

interface CommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: Comment[];
  onAddComment: (text: string, imageUrl?: string, parentId?: string) => void;
  onEditComment?: (commentId: string, text: string, imageUrl?: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDislikeComment?: (commentId: string) => void;
  centerTitle: string;
  currentUserId?: string;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  open,
  onOpenChange,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onDislikeComment,
  centerTitle,
  currentUserId,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-slate-800 flex items-center justify-between">
            <span>Kommentarer for {centerTitle}</span>
            <button
              className="text-lg font-medium border rounded-full text-gray-500 hover:text-white transition-all duration-200 w-8 h-8 flex items-center justify-center hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 shadow-sm hover:shadow-md transform hover:scale-105"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              X
            </button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-180px)] pr-4">
          <div className="py-4 px-1">
            <CommentList
              comments={comments}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onLikeComment={onLikeComment}
              onDislikeComment={onDislikeComment}
              expanded={true}
              currentUserId={currentUserId}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
