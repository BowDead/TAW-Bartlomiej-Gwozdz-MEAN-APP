import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import CommentService from '../modules/services/comment.service';
import { isValidObjectId } from 'mongoose';

class CommentController implements Controller {
    public path = '/api/comments';
    public router = Router();
    public commentService = new CommentService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Otrzymanie komentarczy dla posta o konkretnym id
        this.router.get(`${this.path}/:postId`, this.getCommentsByPostId);
        
        // Tworzenie nowego komentarza
        this.router.post(`${this.path}`, this.createComment);
        
        // Usuwanie komentarza
        this.router.delete(`${this.path}/:id`, this.deleteComment);
        
        // Pobranie wszystkich komentarzy
        this.router.get(`${this.path}`, this.getAllComments);
    }

    private getCommentsByPostId = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { postId } = request.params;
            const comments = await this.commentService.getCommentsByPostId(postId);
            response.status(200).json(comments);
        } catch (error: any) {
            response.status(500).json({ message: error.message || 'Error fetching comments' });
        }
    }

    private createComment = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { content, author, authorId, postId } = request.body;

            if (!content || !author || !postId) {
                response.status(400).json({ message: 'Missing required fields: content, author, postId' });
                return;
            }

            const commentData = {
                content,
                author,
                authorId: authorId || undefined,
                postId,
                createdAt: new Date()
            };

            const comment = await this.commentService.createComment(commentData);
            response.status(201).json(comment);
        } catch (error: any) {
            response.status(500).json({ message: error.message || 'Error creating comment' });
        }
    }

    private deleteComment = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = request.params;
            const { userId } = request.body;

            if (!isValidObjectId(id)) {
                response.status(400).json({ message: 'Invalid comment ID' });
                return;
            }

            const deletedComment = await this.commentService.deleteComment(id, userId);

            if (!deletedComment) {
                response.status(404).json({ message: 'Comment not found' });
                return;
            }

            response.status(200).json({ message: 'Comment deleted successfully', comment: deletedComment });
        } catch (error: any) {
            if (error.message.includes('Unauthorized')) {
                response.status(403).json({ message: error.message });
            } else {
                response.status(500).json({ message: error.message || 'Error deleting comment' });
            }
        }
    }

    private getAllComments = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const comments = await this.commentService.getAllComments();
            response.status(200).json(comments);
        } catch (error: any) {
            response.status(500).json({ message: error.message || 'Error fetching comments' });
        }
    }
}

export default CommentController;
