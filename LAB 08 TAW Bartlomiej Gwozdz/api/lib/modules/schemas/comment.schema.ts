import { Schema, model } from 'mongoose';
import { IComment } from "../models/comment.model";

export const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String },
    postId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model<IComment>('Comment', CommentSchema);
