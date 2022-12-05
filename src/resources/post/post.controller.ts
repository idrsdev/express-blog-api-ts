import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';

import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import catchAsync from '@/utils/catchAsync';
import { IPost } from '@/resources/post/post.interface';
import mongoose from 'mongoose';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}`,
            catchAsync(validationMiddleware(validate.create)),
            catchAsync(this.create)
        );
        this.router.patch(
            `${this.path}/:id`,
            catchAsync(validationMiddleware(validate.update)),
            catchAsync(this.patch)
        );
        this.router.delete(
            `${this.path}/:id`,
            catchAsync(validationMiddleware(validate.update)),
            catchAsync(this.delete)
        );
    }
    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body as IPost;

            const post = await this.PostService.create(title, body);
            res.status(201).json(post);
        } catch (error) {
            next(new HttpException(400, 'Cannot create post'));
        }
    };

    private patch = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
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

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
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

export default PostController;
