import { Document } from 'mongoose';

interface IPost {
    title: string;
    body: string;
}

interface IPostDoc extends IPost, Document {}
export { IPost, IPostDoc };
