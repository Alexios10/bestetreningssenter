
import { Comment } from "../types";
import { generateId } from "./localStorage";
import { User } from "../contexts/AuthContext";

const COMMENTS_KEY = "training-center-comments";

export const getComments = (centerId: string): Comment[] => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments = comments ? JSON.parse(comments) : [];
  // Filter top-level comments (those without a parentId)
  return allComments
    .filter((comment: Comment) => comment.centerId === centerId && !comment.parentId)
    .sort((a: Comment, b: Comment) => b.createdAt - a.createdAt);
};

export const getReplies = (commentId: string): Comment[] => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments = comments ? JSON.parse(comments) : [];
  return allComments
    .filter((comment: Comment) => comment.parentId === commentId)
    .sort((a: Comment, b: Comment) => a.createdAt - b.createdAt);
};

export const addComment = (centerId: string, text: string, user: User, imageUrl?: string, parentId?: string): Comment => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments = comments ? JSON.parse(comments) : [];
  
  const newComment: Comment = {
    id: generateId(),
    centerId,
    text,
    userId: user.id,
    userName: user.name,  // Store the user's name
    createdAt: Date.now(),
    likeCount: 0,
    dislikeCount: 0,
    likes: [], // Initialize as empty array
    dislikes: [], // Initialize as empty array
    ...(imageUrl && { imageUrl }),
    ...(parentId && { parentId }),
  };
  
  // If this is a reply, update the parent comment's replies array
  if (parentId) {
    const parentComment = allComments.find((c: Comment) => c.id === parentId);
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies.push(newComment.id);
      
      // Find the index of the parent comment and update it
      const parentIndex = allComments.findIndex((c: Comment) => c.id === parentId);
      if (parentIndex !== -1) {
        allComments[parentIndex] = parentComment;
      }
    }
  }
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify([...allComments, newComment]));
  return newComment;
};

export const updateComment = (commentId: string, text: string, imageUrl?: string): Comment | null => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return null;
  
  const allComments = JSON.parse(comments);
  const commentIndex = allComments.findIndex((c: Comment) => c.id === commentId);
  
  if (commentIndex === -1) return null;
  
  // Update the comment text and add an editedAt timestamp
  allComments[commentIndex] = {
    ...allComments[commentIndex],
    text,
    editedAt: Date.now(),
    ...(imageUrl !== undefined && { imageUrl }),
  };
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  return allComments[commentIndex];
};

export const deleteComment = (commentId: string): boolean => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return false;
  
  const allComments = JSON.parse(comments);
  const commentToDelete = allComments.find((c: Comment) => c.id === commentId);
  
  if (!commentToDelete) return false;
  
  // If this is a reply, update the parent's replies array
  if (commentToDelete.parentId) {
    const parentIndex = allComments.findIndex((c: Comment) => c.id === commentToDelete.parentId);
    if (parentIndex !== -1 && allComments[parentIndex].replies) {
      allComments[parentIndex].replies = allComments[parentIndex].replies.filter(
        (id: string) => id !== commentId
      );
    }
  }
  
  // If this is a parent comment, also delete all replies
  if (commentToDelete.replies && commentToDelete.replies.length > 0) {
    const replyIds = commentToDelete.replies;
    const filteredComments = allComments.filter((c: Comment) => !replyIds.includes(c.id));
    const filteredWithoutParent = filteredComments.filter((c: Comment) => c.id !== commentId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredWithoutParent));
    return true;
  }
  
  const filteredComments = allComments.filter((c: Comment) => c.id !== commentId);
  
  if (filteredComments.length === allComments.length) return false;
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));
  return true;
};

export const toggleLikeComment = (commentId: string, userId: string): Comment | null => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return null;
  
  const allComments = JSON.parse(comments);
  const commentIndex = allComments.findIndex((c: Comment) => c.id === commentId);
  
  if (commentIndex === -1) return null;
  
  const comment = allComments[commentIndex];
  
  // Initialize likes array if it doesn't exist
  if (!comment.likes) {
    comment.likes = [];
  }
  
  // Initialize dislikes array if it doesn't exist
  if (!comment.dislikes) {
    comment.dislikes = [];
  }
  
  // Check if user already liked the comment
  const likedIndex = comment.likes.indexOf(userId);
  
  if (likedIndex !== -1) {
    // User already liked, so remove the like
    comment.likes = comment.likes.filter((id: string) => id !== userId);
  } else {
    // User hasn't liked, so add like and remove from dislikes if present
    comment.likes.push(userId);
    comment.dislikes = comment.dislikes.filter((id: string) => id !== userId);
  }
  
  // Update like and dislike counts
  comment.likeCount = comment.likes.length;
  comment.dislikeCount = comment.dislikes.length;
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  return comment;
};

export const toggleDislikeComment = (commentId: string, userId: string): Comment | null => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return null;
  
  const allComments = JSON.parse(comments);
  const commentIndex = allComments.findIndex((c: Comment) => c.id === commentId);
  
  if (commentIndex === -1) return null;
  
  const comment = allComments[commentIndex];
  
  // Initialize likes array if it doesn't exist
  if (!comment.likes) {
    comment.likes = [];
  }
  
  // Initialize dislikes array if it doesn't exist
  if (!comment.dislikes) {
    comment.dislikes = [];
  }
  
  // Check if user already disliked the comment
  const dislikedIndex = comment.dislikes.indexOf(userId);
  
  if (dislikedIndex !== -1) {
    // User already disliked, so remove the dislike
    comment.dislikes = comment.dislikes.filter((id: string) => id !== userId);
  } else {
    // User hasn't disliked, so add dislike and remove from likes if present
    comment.dislikes.push(userId);
    comment.likes = comment.likes.filter((id: string) => id !== userId);
  }
  
  // Update like and dislike counts
  comment.likeCount = comment.likes.length;
  comment.dislikeCount = comment.dislikes.length;
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  return comment;
};
