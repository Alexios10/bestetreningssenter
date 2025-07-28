import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { Trash, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { TrainingCenter, Comment } from "../types";
import {
  getAverageRating,
  getUserRating,
  getRatingsByCenter,
  addOrUpdateRating,
} from "../api/ratingService";
import CommentList from "./CommentList";
import CommentsDialog from "./CommentsDialog";
import {
  getCommentsByCenter,
  addComment as addCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
  toggleLikeComment as toggleLikeCommentApi,
  toggleDislikeComment as toggleDislikeCommentApi,
} from "../api/commentService";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/hooks/useAuthModal";

interface TrainingCenterCardProps {
  center: TrainingCenter;
  onDelete: () => void;
  averageRating: number;
  userRating: number | null;
  onRate: (rating: number) => void;
}

const TrainingCenterCard: React.FC<TrainingCenterCardProps> = ({
  center,
  onDelete,
  averageRating: initialAverageRating,
  userRating: initialUserRating,
  onRate: propOnRate,
}) => {
  const { user } = useAuth();
  const [localAverageRating, setLocalAverageRating] =
    useState<number>(initialAverageRating);
  const [localUserRating, setLocalUserRating] = useState<number | null>(
    initialUserRating
  );
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalAverageRating(initialAverageRating);
    setLocalUserRating(initialUserRating);
  }, [initialAverageRating, initialUserRating]);

  useEffect(() => {
    fetchRatings();
    // eslint-disable-next-line
  }, [center.id, user?.id]);

  // Fetch ratings for the center
  const fetchRatings = async () => {
    try {
      const ratings = await getRatingsByCenter(center.id);
      setRatingCount(ratings.length);
      if (user?.id) {
        const userR = await getUserRating(center.id, user.id);
        setLocalUserRating(userR ? userR.rating : null);
      }
    } catch (err) {
      setRatingCount(0);
      setLocalUserRating(null);
    }
  };

  const {
    isAuthModalOpen,
    authModalActionMessage,
    openAuthModal,
    closeAuthModal,
    authSuccess,
    setAuthActionCallback,
  } = useAuthModal();

  // Fetch comments from backend
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getCommentsByCenter(center.id);
      setComments(data);
    } catch (err) {
      toast.error("Kunne ikke laste inn kommentarer");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [center.id]);

  const handleRate = async (rating: number) => {
    if (!user) {
      const canProceed = openAuthModal("vurder dette senteret");
      if (!canProceed) return;
    }

    try {
      await addOrUpdateRating(center.id, rating);
      setLocalUserRating(rating);
      await propOnRate(rating);
      toast.success(`Du ga dette senteret ${rating} stjerner`);
    } catch (error) {
      toast.error("Kunne ikke lagre vurderingen");
    }
  };

  const handleAddComment = async (
    text: string,
    imageUrl?: string,
    parentId?: string
  ) => {
    const canProceed = openAuthModal("Legg til en kommentar");
    if (!canProceed) {
      setAuthActionCallback(() => async () => {
        if (user) {
          await addCommentApi(center.id, text, imageUrl, parentId);
          await fetchComments();
          toast.success(parentId ? "Svar lagt til" : "Kommentar lagt til");
        }
      });
      return;
    }

    if (user) {
      await addCommentApi(center.id, text, imageUrl, parentId);
      await fetchComments();
      toast.success(
        parentId ? "Reply added successfully" : "Comment added successfully"
      );
    }
  };

  const handleEditComment = async (
    commentId: string,
    text: string,
    imageUrl?: string
  ) => {
    await updateCommentApi(commentId, text, imageUrl);
    await fetchComments();
    toast.success("Kommentaren er oppdatert");
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentApi(commentId);
    await fetchComments();
    toast.success("Kommentaren slettet");
  };

  const handleLikeComment = async (commentId: string) => {
    const canProceed = openAuthModal("like denne kommentaren");
    if (!canProceed) {
      setAuthActionCallback(() => async () => {
        await toggleLikeCommentApi(commentId);
        await fetchComments();
      });
      return;
    }
    await toggleLikeCommentApi(commentId);
    await fetchComments();
  };

  const handleDislikeComment = async (commentId: string) => {
    const canProceed = openAuthModal("mislike denne kommentaren");
    if (!canProceed) {
      setAuthActionCallback(() => async () => {
        await toggleDislikeCommentApi(commentId);
        await fetchComments();
      });
      return;
    }
    await toggleDislikeCommentApi(commentId);
    await fetchComments();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength || expanded) return text;
    return text.substr(0, maxLength) + "...";
  };

  const topLevelComments = comments.filter((c) => !c.parentId);

  // Only attach replies whose parent exists in topLevelComments
  const commentIds = new Set(topLevelComments.map((c) => c.id));
  const replies = comments.filter(
    (c) => c.parentId && commentIds.has(c.parentId)
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            center.imageUrl ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={center.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x200?text=Image+Not+Found";
          }}
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {center.title}
          </h3>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <StarRating rating={localAverageRating} size={18} />
            <span className="ml-1 text-sm text-gray-500">({ratingCount})</span>
            {/* <span className="text-xs text-gray-500 ml-2">
              {averageRating > 0
                ? `Gjennomsnitt`
                : "Ingen vurderinger så langt"}
            </span> */}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {truncateText(center.description, 120)}
          {/* {center.description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium text-sm"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )} */}
        </p>

        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">
              {localUserRating ? "Din vurdering:" : "Vurder dette senteret:"}
            </span>
            <StarRating
              rating={localUserRating || 0}
              onRatingChange={handleRate}
              interactive={true}
              size={22}
            />
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Kommentarer ({comments.length})
            </h4>
            <button
              onClick={() => setShowCommentsDialog(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Vis alle
            </button>
          </div>
          <div className="transition-all duration-300">
            <CommentList
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onLikeComment={handleLikeComment}
              onDislikeComment={handleDislikeComment}
              loading={loadingComments}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <CommentsDialog
        open={showCommentsDialog}
        onOpenChange={setShowCommentsDialog}
        comments={comments}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
        onDislikeComment={handleDislikeComment}
        centerTitle={center.title}
        currentUserId={user?.id}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={authSuccess}
        actionMessage={authModalActionMessage}
      />
    </div>
  );
};

export default TrainingCenterCard;
