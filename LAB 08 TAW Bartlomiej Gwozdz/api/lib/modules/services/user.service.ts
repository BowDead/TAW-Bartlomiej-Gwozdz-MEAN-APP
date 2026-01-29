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
}

export default UserService;
