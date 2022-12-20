import { Request, Response, NextFunction } from 'express';

import UserService from '@/User/user.service';
import HttpException from '@/exceptions/http.exception';
import { IUser, IUserLogin } from '@/User/user.interface';

class UserController {
    private UserService = new UserService();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    register = async (
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

    login = async (
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

    getUser = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new HttpException(400, 'No logged in user'));
        }

        res.status(200).json({ user: req.user });
    };
}

export default new UserController();
