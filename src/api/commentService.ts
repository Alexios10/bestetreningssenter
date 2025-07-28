import { API_BASE_URL, getHeaders, handleResponse } from "./apiConfig";
import { Comment } from "../types";

export const getCommentsByCenter = async (
  centerId: string
): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/comments/center/${centerId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data as Comment[];
};

export const getRepliesByComment = async (
  commentId: string
): Promise<Comment[]> => {
  const response = await fetch(
    `${API_BASE_URL}/comments/${commentId}/replies`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await handleResponse(response);
  return data as Comment[];
};

export const addComment = async (
  centerId: string,
  text: string,
  imageUrl?: string,
  parentId?: string
): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      CenterId: centerId, // <-- PascalCase
      Text: text,
      ImageUrl: imageUrl,
      ParentId: parentId,
    }),
  });

  const data = await handleResponse(response);
  return data as Comment;
};

export const updateComment = async (
  commentId: string,
  text: string,
  imageUrl?: string
): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ text, imageUrl }),
  });

  const data = await handleResponse(response);
  return data as Comment;
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  await handleResponse(response);
  return true;
};

export const toggleLikeComment = async (
  commentId: string
): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: "POST",
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data as Comment;
};

export const toggleDislikeComment = async (
  commentId: string
): Promise<Comment> => {
  const response = await fetch(
    `${API_BASE_URL}/comments/${commentId}/dislike`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  const data = await handleResponse(response);
  return data as Comment;
};
