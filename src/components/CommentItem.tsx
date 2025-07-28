import React, { useState, useRef } from "react";
import { Comment } from "../types";
import { format } from "date-fns";
import {
  MessageSquare,
  Edit,
  Trash,
  Image,
  ImageOff,
  ThumbsUp,
  ThumbsDown,
  Smile,
  MessageSquareReply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  onEditComment?: (commentId: string, text: string, imageUrl?: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDislikeComment?: (commentId: string) => void;
  onReplyComment?: (parentId: string, text: string, imageUrl?: string) => void;
  onOpenImageModal?: (imageUrl: string) => void;
  commonEmojis: string[];
  currentUserId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies = [],
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onDislikeComment,
  onReplyComment,
  onOpenImageModal,
  commonEmojis,
  currentUserId,
}) => {
  const [editingComment, setEditingComment] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editCommentImage, setEditCommentImage] = useState<string | null>(
    comment.imageUrl || null
  );
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  // Track which reply is currently being edited
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [editReplyImage, setEditReplyImage] = useState<string | null>(null);
  // Set repliesExpanded to false by default
  const [repliesExpanded, setRepliesExpanded] = useState(false);

  const editCommentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);
  const editReplyInputRef = useRef<HTMLTextAreaElement>(null);
  const editReplyFileInputRef = useRef<HTMLInputElement>(null);

  const handleEditStart = () => {
    setEditingComment(true);
    setEditText(comment.text);
    setEditCommentImage(comment.imageUrl || null);
  };

  const handleEditSave = () => {
    if ((editText.trim() || editCommentImage) && onEditComment) {
      onEditComment(comment.id, editText.trim(), editCommentImage || undefined);
      setEditingComment(false);
    }
  };

  const handleEditCancel = () => {
    setEditingComment(false);
    setEditText(comment.text);
    setEditCommentImage(comment.imageUrl || null);
  };

  const handleReplyEditStart = (reply: Comment) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.text);
    setEditReplyImage(reply.imageUrl || null);
  };

  const handleReplyEditSave = () => {
    if (
      (editReplyText.trim() || editReplyImage) &&
      onEditComment &&
      editingReplyId
    ) {
      onEditComment(
        editingReplyId,
        editReplyText.trim(),
        editReplyImage || undefined
      );
      setEditingReplyId(null);
    }
  };

  const handleReplyEditCancel = () => {
    setEditingReplyId(null);
    setEditReplyText("");
    setEditReplyImage(null);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isReply = false,
    isReplyEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isReplyEdit) {
        setEditReplyImage(base64String);
      } else if (isReply) {
        setReplyImage(base64String);
      } else {
        setEditCommentImage(base64String);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset input
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !replyImage) return;
    if (onReplyComment) {
      await onReplyComment(comment.id, replyText.trim(), replyImage);
      setReplyText("");
      setReplyImage(null);
      setShowReplyForm(false);
    }
  };

  const removeImage = (isReply = false, isReplyEdit = false) => {
    if (isReplyEdit) {
      setEditReplyImage(null);
    } else if (isReply) {
      setReplyImage(null);
    } else {
      setEditCommentImage(null);
    }
  };

  const insertEmoji = (emoji: string, isReply = false, isReplyEdit = false) => {
    if (isReplyEdit) {
      setEditReplyText((prev) => prev + emoji);
      if (editReplyInputRef.current) {
        editReplyInputRef.current.focus();
      }
    } else if (isReply) {
      setReplyText((prev) => prev + emoji);
      if (replyTextareaRef.current) {
        replyTextareaRef.current.focus();
      }
    } else {
      setEditText((prev) => prev + emoji);
      if (editCommentInputRef.current) {
        editCommentInputRef.current.focus();
      }
    }
  };

  const isLiked = () => comment.isLikedByCurrentUser;
  const isDisliked = () => comment.isDislikedByCurrentUser;

  const isReplyLiked = (reply: Comment) => reply.isLikedByCurrentUser;

  const isReplyDisliked = (reply: Comment) => reply.isDislikedByCurrentUser;

  const renderEditForm = (
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    image: string | null,
    inputRef: React.RefObject<HTMLTextAreaElement>,
    fileRef: React.RefObject<HTMLInputElement>,
    handleSave: () => void,
    handleCancel: () => void,
    isReplyEdit = false
  ) => (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[80px] pr-10 resize-y"
        />
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Add emoji"
            >
              <Smile size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="grid grid-cols-5 gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji, false, isReplyEdit)}
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
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-2 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          title="Change image"
        >
          <Image size={18} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(e, false, isReplyEdit)}
        />
      </div>

      {image && (
        <div className="relative inline-block">
          <img
            src={image}
            alt="Comment attachment"
            className="max-h-40 rounded-md object-contain border border-gray-200"
          />
          <button
            type="button"
            onClick={() => removeImage(false, isReplyEdit)}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <ImageOff size={14} />
          </button>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Avbryt
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!text.trim() && !image}
        >
          Lagre
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-3 rounded-md transform transition-all duration-300 animate-fade-in">
      {editingComment ? (
        renderEditForm(
          editText,
          setEditText,
          editCommentImage,
          editCommentInputRef,
          editFileInputRef,
          handleEditSave,
          handleEditCancel
        )
      ) : (
        <>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {comment.userName || `Bruker ${comment.userId.slice(-4)}`}
              </span>
              <span className="text-xs text-gray-400">
                {format(comment.createdAt, "MMM d, yyyy")}
                {comment.editedAt && " (edited)"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {onEditComment && comment.userId === currentUserId && (
                <button
                  onClick={handleEditStart}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Endre Kommentar"
                >
                  <Edit size={14} />
                </button>
              )}
              {onDeleteComment && comment.userId === currentUserId && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Slett Kommentar"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-700 text-sm">{comment.text}</p>

          {comment.imageUrl && (
            <div className="mt-2">
              <img
                src={comment.imageUrl}
                alt="Comment attachment"
                className="max-h-60 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onOpenImageModal?.(comment.imageUrl!)}
              />
            </div>
          )}

          <div className="mt-2 pt-1 border-t border-gray-100 flex items-center gap-4">
            <button
              onClick={() => onLikeComment?.(comment.id)}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-colors ${
                isLiked()
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="Liker"
            >
              <ThumbsUp size={14} />
              <span>{comment.likeCount ?? 0}</span>
            </button>

            <button
              onClick={() => onDislikeComment?.(comment.id)}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-colors ${
                isDisliked()
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="Misliker"
            >
              <ThumbsDown size={14} />
              <span>{comment.dislikeCount ?? 0}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-sm px-2 py-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              title="Svar"
            >
              <MessageSquareReply size={14} />
              <span>Svar</span>
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <form onSubmit={handleReplySubmit} className="space-y-2">
                <div className="relative">
                  <Textarea
                    ref={replyTextareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Skriv et svar..."
                    className="min-h-[80px] pr-10 resize-y text-sm"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Legg til emoji"
                      >
                        <Smile size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="end">
                      <div className="grid grid-cols-5 gap-2">
                        {commonEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji, true)}
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
                    type="button"
                    onClick={() => replyFileInputRef.current?.click()}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    title="Legg til bilde"
                  >
                    <Image size={16} />
                  </button>
                  <input
                    ref={replyFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, true)}
                  />

                  <div className="flex gap-2 ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyText("");
                        setReplyImage(null);
                      }}
                    >
                      Avbryt
                    </Button>

                    <Button
                      type="submit"
                      size="sm"
                      disabled={!replyText.trim() && !replyImage}
                    >
                      Svar
                    </Button>
                  </div>
                </div>

                {replyImage && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={replyImage}
                      alt="Reply attachment"
                      className="max-h-32 rounded-md object-contain border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(true)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Slett bilde"
                    >
                      <ImageOff size={12} />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Display replies with collapsible functionality */}
          {replies.length > 0 && (
            <div className="mt-3">
              <Collapsible
                open={repliesExpanded}
                onOpenChange={setRepliesExpanded}
                className="w-full"
              >
                <div className="flex items-center justify-between border-l-2 border-gray-200 pl-2 py-1">
                  <span className="text-xs text-gray-500 ml-2">
                    {replies.length} Svar
                  </span>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 rounded-full hover:bg-gray-100">
                      {repliesExpanded ? (
                        <>
                          <span>Skjul alle</span>
                          <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span>Vis alle</span>
                          <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="pl-4 border-l-2 border-gray-200 space-y-3 mt-1">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-gray-100 p-2 rounded-md"
                      >
                        {editingReplyId === reply.id ? (
                          renderEditForm(
                            editReplyText,
                            setEditReplyText,
                            editReplyImage,
                            editReplyInputRef,
                            editReplyFileInputRef,
                            handleReplyEditSave,
                            handleReplyEditCancel,
                            true
                          )
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <MessageSquareReply
                                  size={12}
                                  className="text-gray-500"
                                />
                                <span className="text-xs text-gray-600">
                                  {reply.userName ||
                                    `Bruker ${reply.userId.slice(-4)}`}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {format(reply.createdAt, "MMM d, yyyy")}
                                  {reply.editedAt && " (edited)"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {onEditComment &&
                                  reply.userId === currentUserId && (
                                    <button
                                      onClick={() =>
                                        handleReplyEditStart(reply)
                                      }
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                      title="Endre svar"
                                    >
                                      <Edit size={12} />
                                    </button>
                                  )}
                                {onDeleteComment &&
                                  reply.userId === currentUserId && (
                                    <button
                                      onClick={() => onDeleteComment(reply.id)}
                                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                      title="Slette svar"
                                    >
                                      <Trash size={12} />
                                    </button>
                                  )}
                              </div>
                            </div>
                            <p className="text-gray-700 text-xs">
                              {reply.text}
                            </p>

                            {reply.imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={reply.imageUrl}
                                  alt="Reply attachment"
                                  className="max-h-40 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    onOpenImageModal?.(reply.imageUrl!)
                                  }
                                />
                              </div>
                            )}

                            {/* Add like/dislike for replies */}
                            <div className="mt-2 pt-1 flex items-center gap-3">
                              <button
                                onClick={() => onLikeComment?.(reply.id)}
                                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                                  isReplyLiked(reply)
                                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                                title="Liker"
                              >
                                <ThumbsUp size={10} />
                                <span>{reply.likeCount ?? 0}</span>
                              </button>

                              <button
                                onClick={() => onDislikeComment?.(reply.id)}
                                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                                  isReplyDisliked(reply)
                                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                                title="Misliker"
                              >
                                <ThumbsDown size={10} />
                                <span>{reply.dislikeCount ?? 0}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentItem;
