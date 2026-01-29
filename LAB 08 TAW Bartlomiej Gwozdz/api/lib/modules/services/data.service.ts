import {IPost, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
    public async createPost(postParams: IPost) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
            return dataModel;
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0, _id: 0 });
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getById(id: string) {
        try {
            const result = await PostModel.findById(id, { __v: 0 });
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async deleteById(id: string) {
        try {
            await PostModel.findByIdAndDelete(id);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getAll() {
        try {
            const result = await PostModel.find({}, { __v: 0 });
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania wszystkich danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania wszystkich danych');
        }
    }

    public async deleteAllPosts() {
        try {
            await PostModel.deleteMany({});
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania wszystkich danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania wszystkich danych');
        }
    }

    public async getPostsByUserId(userId: string) {
        try {
            const result = await PostModel.find({ userId }, { __v: 0 });
            return result;
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania postów użytkownika:', error);
            throw new Error('Wystąpił błąd podczas pobierania postów użytkownika');
        }
    }

}

export default DataService;

