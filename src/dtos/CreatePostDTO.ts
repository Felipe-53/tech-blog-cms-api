import { Post } from "../entities/Post";

export type CreatePostDTO = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'slug'>
