import express, { Application } from 'express';

import validate from '@/User/user.validation';
import catchAsync from '@/common/utils/catchAsync';
import userController from '@/User/user.controller';
import { RouteConfig } from '@/common/common.route.config';
import authenticated from '@/middleware/authentication.middleware';
import validationMiddleware from '@/common/middleware/validation.middleware';

export class UserRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'UserRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route('/api/user/register')
            .post([
                validationMiddleware(validate.register),
                catchAsync(userController.register),
            ]);

        this.app
            .route('/api/user/login')
            .post([validationMiddleware(validate.login), userController.login]);

        this.app
            .route('/api/user/me')
            .get(catchAsync(authenticated), [userController.getUser]);

        return this.app;
    }
}
