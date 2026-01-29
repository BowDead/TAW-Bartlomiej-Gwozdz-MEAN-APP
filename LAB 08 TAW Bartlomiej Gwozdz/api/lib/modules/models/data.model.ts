export interface IPost {
    title: string;
    text: string;
    image: string;
    userId?: string;
}

export type Query<T> = {
    [key: string]: T;
};