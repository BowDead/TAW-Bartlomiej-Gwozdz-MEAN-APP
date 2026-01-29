import UserModel from "../schemas/user.schema";
import { IUser } from "../models/user.model";

class UserService {
    private user = UserModel;

    public async createUser(userData: Partial<IUser>): Promise<IUser> {
        const newUser = new this.user(userData);
        return await newUser.save();
    }

    public async findUserByEmail(email: string): Promise<IUser | null> {
        return await this.user.findOne({ email });
    }

    public async findUserById(id: string): Promise<IUser | null> {
        return await this.user.findById(id);
    }

    public async deleteUser(id: string): Promise<boolean> {
        const result = await this.user.findByIdAndDelete(id);
        return result !== null;
    }

    public async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await this.user.findByIdAndUpdate(
            id, 
            { $set: userData },
            { new: true, runValidators: true }
        );
    }

    public async addFavoritePost(userId: string, postId: string): Promise<IUser | null> {
        return await this.user.findByIdAndUpdate(
            userId,
            { $addToSet: { favoritePosts: postId } },
            { new: true }
        );
    }

    public async removeFavoritePost(userId: string, postId: string): Promise<IUser | null> {
        return await this.user.findByIdAndUpdate(
            userId,
            { $pull: { favoritePosts: postId } },
            { new: true }
        );
    }

    public async addHiddenPost(userId: string, postId: string): Promise<IUser | null> {
        return await this.user.findByIdAndUpdate(
            userId,
            { $addToSet: { hiddenPosts: postId } },
            { new: true }
        );
    }

    public async removeHiddenPost(userId: string, postId: string): Promise<IUser | null> {
        return await this.user.findByIdAndUpdate(
            userId,
            { $pull: { hiddenPosts: postId } },
            { new: true }
        );
    }

    public async getFavoritePosts(userId: string): Promise<string[]> {
        const user = await this.user.findById(userId).select('favoritePosts');
        return user?.favoritePosts || [];
    }

    public async getHiddenPosts(userId: string): Promise<string[]> {
        const user = await this.user.findById(userId).select('hiddenPosts');
        return user?.hiddenPosts || [];
    }
}

export default UserService;
