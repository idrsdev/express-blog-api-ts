import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authentication.middleware';
import catchAsync from '@/utils/catchAsync';
import { IUser, IUserLogin } from '@/resources/user/user.interface';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialRoutes();
    }

    private initialRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            catchAsync(validationMiddleware(validate.register)),
            catchAsync(this.register)
        );
        this.router.post(
            `${this.path}/login`,
            catchAsync(validationMiddleware(validate.login)),
            catchAsync(this.login)
        );
        this.router.get(
            `${this.path}/me`,
            catchAsync(authenticated),
            this.getUser
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, email, password } = req.body as IUser;
            const token = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );
            res.status(201).json({ token });
        } catch (error: unknown) {
            next(new HttpException(400, (error as Error).message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body as IUserLogin;
            const token = await this.UserService.login(email, password);

            res.status(200).json({ token });
        } catch (error: unknown) {
            next(new HttpException(400, (error as Error).message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            next(new HttpException(400, 'No logged in user'));
        }

        res.status(200).json({ user: req.user });
    };
}

export default UserController;
