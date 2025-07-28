// import { Comment } from "../types";
// import { User } from "../contexts/AuthContext";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const getComments = async (centerId: string): Promise<Comment[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/comments/${centerId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return [];
//   }
// };

// export const getReplies = async (commentId: string): Promise<Comment[]> => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/comments/${commentId}/replies`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching replies:", error);
//     return [];
//   }
// };

// export const addComment = async (
//   centerId: string,
//   text: string,
//   user: User,
//   imageUrl?: string,
//   parentId?: string
// ): Promise<Comment> => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/comments`, {
//       centerId,
//       text,
//       userId: user.id,
//       userName: user.name,
//       imageUrl,
//       parentId,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw error;
//   }
// };

// export const updateComment = async (
//   commentId: string,
//   text: string,
//   imageUrl?: string
// ): Promise<Comment | null> => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, {
//       text,
//       imageUrl,
//       editedAt: Date.now(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating comment:", error);
//     return null;
//   }
// };

// export const deleteComment = async (commentId: string): Promise<boolean> => {
//   try {
//     await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
//     return true;
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     return false;
//   }
// };

// export const toggleLikeComment = async (
//   commentId: string,
//   userId: string
// ): Promise<Comment | null> => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/comments/${commentId}/like`,
//       {
//         userId,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     return null;
//   }
// };

// export const toggleDislikeComment = async (
//   commentId: string,
//   userId: string
// ): Promise<Comment | null> => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/comments/${commentId}/dislike`,
//       {
//         userId,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error toggling dislike:", error);
//     return null;
//   }
// };
