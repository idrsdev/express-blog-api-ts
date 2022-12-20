import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import PostService from '@/Memory/memory.service';
import { IPost } from '@/Memory/memory.interface';
import HttpException from '@/exceptions/http.exception';
class PostController {
    private PostService = new PostService();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { title, body } = req.body as IPost;
            const post = await this.PostService.create(title, body);
            res.status(201).json(post);
        } catch (error) {
            next(new HttpException(400, 'Cannot create post'));
        }
    };

    patch = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            !mongoose.isValidObjectId(id) &&
                next(new HttpException(400, 'Invalid Post Id'));

            const postIdentifier = new mongoose.Types.ObjectId(id);
            const toBeUpdatedFields = req.body as IPost;

            const post = await this.PostService.patch(
                postIdentifier,
                toBeUpdatedFields
            );
            res.status(201).json(post);
        } catch (error) {
            next(new HttpException(400, 'Cannot Update post'));
        }
    };

    delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            !mongoose.isValidObjectId(id) &&
                next(new HttpException(400, 'Invalid Post Id'));

            const postIdentifier = new mongoose.Types.ObjectId(id);

            const post = await this.PostService.delete(postIdentifier);

            res.status(201).json(post);
        } catch (error) {
            next(new HttpException(400, (error as Error).message));
        }
    };
}

export default new PostController();
