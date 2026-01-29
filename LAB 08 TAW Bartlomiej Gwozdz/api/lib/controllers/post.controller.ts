import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { isValidObjectId } from 'mongoose';
import {checkPostCount} from "../middlewares/checkPostCount.middleware";
import DataService from "../modules/services/data.service";
import { upload } from "../middlewares/upload.middleware";
import { Request as ExpressRequest } from 'express';
import jwt from 'jsonwebtoken';

// sample in-memory posts used by demo endpoints
let testArr = [
    {
        id: '1',
        title: 'Pierwszy post',
        text: 'To jest przykładowa treść pierwszego posta.',
        image: 'https://picsum.photos/200'
    },
    {
        id: '2',
        title: 'Drugi post',
        text: 'Drugi przykład wpisu na blogu z krótkim opisem.',
        image: 'https://picsum.photos/200'
    },
    {
        id: '3',
        title: 'Angular 17',
        text: 'Nowe sterowanie przepływem @if i @for w Angularze.',
        image: 'https://picsum.photos/200'
    },
    {
        id: '4',
        title: 'Backend Node',
        text: 'Serwer Express z prostym API do postów.',
        image: 'https://picsum.photos/200'
    },
    {
        id: '5',
        title: 'Galeria zdjęć',
        text: 'Przykładowa galeria obrazów dla postów.',
        image: 'https://picsum.photos/200'
    },
    {
        id: '6',
        title: 'EEEEEE',
        text: 'Przykładowa galeria obrazów dla postów.',
        image: 'https://picsum.photos/200'
    }
];

class PostController implements Controller {
    public path = '/api/post';
    public router = Router();
    public dataService = new DataService;
    private jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    constructor() {
        this.initializeRoutes();
   }

    private getUserIdFromToken(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) return null;
        
        const token = authHeader.split(' ')[1];
        if (!token) return null;
        
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
            return decoded.userId || null;
        } catch (error) {
            return null;
        }
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.post(`${this.path}/add`, upload.single('image'), this.handleUploadError.bind(this), this.addData);
        this.router.post(`${this.path}/:num`,checkPostCount, upload.single('image'), this.handleUploadError.bind(this), this.addData);
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.post(`${this.path}`, this.addEmpty);
        this.router.delete(`${this.path}/:id`, this.removePost);
        
        this.router.get(`/api/posts`, this.getAllData);
        this.router.post(`/api/posts`, upload.single('image'), this.handleUploadError.bind(this), this.addNewPost);
        this.router.delete(`/api/posts`, this.delAllData);
        this.router.get(`/api/posts/:id`, this.getByIdAlt);
        this.router.delete(`/api/posts/:id`, this.removePost);
   }

    private handleUploadError = (err: any, request: Request, response: Response, next: NextFunction) => {
        if (err) {
            console.error('Upload error:', err);
            return response.status(400).json({ error: err.message });
        }
        next();
    }

    private getAllData = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const posts = await this.dataService.getAll();
            response.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    };


    private getNData = async (request: Request, response: Response, next: NextFunction) => {
        const { num } = request.params;
        const count = Number(num);

        if (isNaN(count) || count <= 0) {
            return response.status(400).json({ error: "Invalid number of items requested" });
        }

        try {
            const allPosts = await this.dataService.getAll();
            const result = allPosts.slice(0, count);
            response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    private delAllData = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.dataService.deleteAllPosts();
            response.status(200).json({ message: 'All posts deleted successfully' });
        } catch (error) {
            next(error);
        }
    };

    private delData = async (request: Request, response: Response, next: NextFunction) => {
         try {
            const { id } = request.params;

            if (!isValidObjectId(id)) {
                return response.status(400).json({ error: "Invalid ID format" });
            }

            await this.dataService.deleteById(id);
            const allPosts = await this.dataService.getAll();
            response.status(200).json(allPosts);
        } catch (error) {
            next(error);
        }
    };

    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const posts = await this.dataService.getAll();
            response.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    };

    private getById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        if (!isValidObjectId(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }
            response.status(200).json(post);
        } catch (error) {
            next(error);
        }
    };

    private getByIdAlt = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        if (!isValidObjectId(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }
            response.status(200).json(post);
        } catch (error) {
            next(error);
        }
    };

    private addData = async (request: Request & { file?: Express.Multer.File }, response: Response, next: NextFunction) => {
        const {title, text} = request.body;
        let image = request.body.image;

        console.log('addData - request.file:', request.file);
        console.log('addData - request.body.image:', request.body.image);


        if (request.file) {
            console.log('File uploaded:', request.file.filename);
            image = `/images/${request.file.filename}`;
        }

        const missingFields = [
            title ? null : 'title',
            text ? null : 'text',
            image ? null : 'image'
        ].filter(Boolean);

        if (missingFields.length) {
            return response.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const userId = this.getUserIdFromToken(request);
        const readingData = { title, text, image, userId };

        try {
            const created = await this.dataService.createPost(readingData);
            response.status(200).json(created);
        } catch (error) {
            console.log('eeee', error)

            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        if (!isValidObjectId(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        try {
            const post = await this.dataService.getById(id);
            if (!post) {
                return response.status(404).json({ error: 'Post not found' });
            }
            response.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        if (!isValidObjectId(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }
        try {
            await this.dataService.deleteById(id);
            response.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            next(error);
        }
    };


    private addEmpty = async (request: Request, response: Response, next: NextFunction) => {
         try {
            const emptyPost = {
                title: 'Pusty wpis',
                text: '',
                image: ''
            };
            
            const created = await this.dataService.createPost(emptyPost);
            const allPosts = await this.dataService.getAll();
            response.status(200).json(allPosts);
        } catch (error) {
            next(error);
        }
    };

    private addNewPost = async (request: Request & { file?: Express.Multer.File }, response: Response, next: NextFunction) => {
        const { title, text } = request.body;
        let image = request.body.image;

        console.log('addNewPost - request.file:', request.file);
        console.log('addNewPost - request.body.image:', request.body.image);

        if (request.file) {
            console.log('File uploaded:', request.file.filename);
            image = `/images/${request.file.filename}`;
        }

        const missingFields = [
            title ? null : 'title',
            text ? null : 'text',
            image ? null : 'image'
        ].filter(Boolean);

        if (missingFields.length) {
            return response.status(400).json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const userId = this.getUserIdFromToken(request);
        const newPost = {
            title,
            text,
            image,
            userId
        };

        try {
            const created = await this.dataService.createPost(newPost);
            response.status(201).json(created);
        } catch (error) {
            console.error('Error adding new post:', error);
            response.status(500).json({ error: 'Failed to add post' });
        }
    };

}

export default PostController;