export interface TrainingCenter {
  ratingCount: number;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  createdBy: string; // For future auth implementation
}

export interface Rating {
  id: string;
  centerId: string;
  rating: number; // 1-5
  userId: string; // For future auth implementation
  createdAt: number;
}

export interface Comment {
  id: string;
  centerId: string;
  userId: string;
  userName?: string;
  text: string;
  createdAt: number;
  editedAt?: number;
  imageUrl?: string;
  parentId?: string;
  replies?: string[];
  likeCount: number;
  dislikeCount: number;
  likes?: string[]; // Array of user IDs who liked
  dislikes?: string[]; // Array of user IDs who disliked
  isLikedByCurrentUser?: boolean;
  isDislikedByCurrentUser?: boolean;
}
