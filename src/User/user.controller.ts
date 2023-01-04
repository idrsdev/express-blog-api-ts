import { Request, Response, NextFunction } from 'express';

import UserService from '@/User/user.service';
import HttpException from '@/exceptions/http.exception';
import { LoginUserBody, RegisterUserBody } from '@/User/user.validation';

class UserController {
    private UserService = new UserService();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    registerUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { name, email, password } = req.body as RegisterUserBody;

        const response = await this.UserService.registerUserService(
            name,
            email,
            password
        );

        if (response instanceof HttpException) {
            return next(response);
        }

        return res.status(response.statusCode).json(response.data);
    };

    authenticateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { email, password } = req.body as LoginUserBody;

        const response = await this.UserService.authenticateUserService(
            email,
            password
        );

        if (response instanceof HttpException) {
            return next(response);
        }

        return res.status(response.statusCode).json(response.data);
    };

    getUser = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new HttpException(400, 'No logged in user'));
        }

        res.status(200).json({ user: req.user });
    };
}

export default new UserController();
