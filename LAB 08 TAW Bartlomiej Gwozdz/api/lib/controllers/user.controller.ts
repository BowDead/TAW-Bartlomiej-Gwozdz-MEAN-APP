import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import UserService from '../modules/services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();
    private jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.createUser);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:id`, this.logout);
        this.router.get(`${this.path}/profile/:id`, this.getUserProfile);
        this.router.put(`${this.path}/profile/:id`, this.updateUserProfile);
    }

    private createUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { name, email, password } = request.body;

            if (!name || !email || !password) {
                return response.status(400).json({ error: 'Name, email, and password are required' });
            }

            // Check if user already exists
            const existingUser = await this.userService.findUserByEmail(email);
            if (existingUser) {
                return response.status(409).json({ error: 'User with this email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await this.userService.createUser({
                name,
                email,
                password: hashedPassword
            });

            response.status(201).json({ 
                message: 'User created successfully',
                userId: user._id 
            });
        } catch (error) {
            console.error('Error creating user:', error);
            next(error);
        }
    };

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { login, password } = request.body;

            if (!login || !password) {
                return response.status(400).json({ error: 'Login and password are required' });
            }

            // Find user by email
            const user = await this.userService.findUserByEmail(login);
            if (!user) {
                return response.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    email: user.email,
                    name: user.name 
                },
                this.jwtSecret,
                { expiresIn: '24h' }
            );

            response.status(200).json({ 
                token,
                userId: user._id,
                name: user.name,
                email: user.email
            });
        } catch (error) {
            console.error('Error authenticating user:', error);
            next(error);
        }
    };

    private logout = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            
            // In a JWT-based auth system, logout is primarily handled client-side
            // by removing the token. This endpoint is here for compatibility
            // and could be extended to implement token blacklisting if needed.
            
            response.status(200).json({ 
                message: 'Logged out successfully' 
            });
        } catch (error) {
            console.error('Error logging out:', error);
            next(error);
        }
    };

    private getUserProfile = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            
            const user = await this.userService.findUserById(id);
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            // Import DataService dynamically to avoid circular dependencies
            const DataService = (await import('../modules/services/data.service')).default;
            const dataService = new DataService();
            const userPosts = await dataService.getPostsByUserId(id);

            response.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                postsCount: userPosts.length,
                posts: userPosts
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            next(error);
        }
    };

    private updateUserProfile = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { name, email } = request.body;

            if (!name && !email) {
                return response.status(400).json({ error: 'At least one field (name or email) is required' });
            }

            const updateData: any = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;

            const updatedUser = await this.userService.updateUser(id, updateData);
            if (!updatedUser) {
                return response.status(404).json({ error: 'User not found' });
            }

            response.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    createdAt: updatedUser.createdAt
                }
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            next(error);
        }
    };
}

export default UserController;
