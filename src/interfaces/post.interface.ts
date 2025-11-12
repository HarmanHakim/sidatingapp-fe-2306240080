export interface Post {
  id: string;
  userProfileId: string;
  userProfileName: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: string[];
  likeCount: number;
  timeAgo: string;
}

export interface PostRequest {
  userProfileId: string;
  userProfileName: string;
  imageUrl: string;
  caption: string;
}

export interface PostQueryParams {
  userId?: string;
  date?: string;
}

export interface CreatePostRequest {
  userProfileId: string;
  imageUrl: string;
  caption: string;
}

export interface DeletePostRequest {
  id: string;
}

export interface LikePostRequest {
  id: string;
  userProfileId: string;
}

export interface UpdatePostRequest {
  id: string;
  imageUrl: string;
  caption: string;
}