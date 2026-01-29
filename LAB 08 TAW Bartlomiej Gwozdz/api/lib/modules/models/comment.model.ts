import { Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: string;
    authorId?: string;
    postId: string;
    createdAt: Date;
}
