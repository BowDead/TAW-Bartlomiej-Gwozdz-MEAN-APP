import CommentModel from "../schemas/comment.schema";
import { IComment } from "../models/comment.model";

class CommentService {
    
    public async getCommentsByPostId(postId: string): Promise<IComment[]> {
        try {
            return await CommentModel.find({ postId }).sort({ createdAt: -1 }).exec();
        } catch (error) {
            throw new Error(`Error fetching comments: ${error}`);
        }
    }

    public async createComment(commentData: Partial<IComment>): Promise<IComment> {
        try {
            const comment = new CommentModel(commentData);
            return await comment.save();
        } catch (error) {
            throw new Error(`Error creating comment: ${error}`);
        }
    }

    public async deleteComment(commentId: string, userId?: string): Promise<IComment | null> {
        try {
            const comment = await CommentModel.findById(commentId);
            
            if (!comment) {
                return null;
            }

            if (userId && comment.authorId !== userId) {
                throw new Error('Unauthorized to delete this comment');
            }

            return await CommentModel.findByIdAndDelete(commentId);
        } catch (error) {
            throw new Error(`Error deleting comment: ${error}`);
        }
    }

    public async getAllComments(): Promise<IComment[]> {
        try {
            return await CommentModel.find().sort({ createdAt: -1 }).exec();
        } catch (error) {
            throw new Error(`Error fetching all comments: ${error}`);
        }
    }
}

export default CommentService;
