import { Schema, model } from 'mongoose';
import { IUser } from "../models/user.model";

export const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    favoritePosts: [{ type: Schema.Types.ObjectId, ref: 'Post-BG', default: [] }],
    hiddenPosts: [{ type: Schema.Types.ObjectId, ref: 'Post-BG', default: [] }]
});

export default model<IUser>('User', UserSchema);
