import express, { Application } from 'express';

import validate from '@/Memory/memory.validation';
import catchAsync from '@/common/utils/catchAsync';
import memoryController from '@/Memory/memory.controller';
import { RouteConfig } from '@/common/common.route.config';
import validationMiddleware from '@/common/middleware/validation.middleware';

export class MemoryRoutes extends RouteConfig {
    constructor(app: Application) {
        super(app, 'PostRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route('/api/memory')
            .post([
                catchAsync(validationMiddleware(validate.create)),
                catchAsync(memoryController.create),
            ]);

        this.app
            .route('/api/memory/:id')
            .patch([
                catchAsync(validationMiddleware(validate.update)),
                catchAsync(memoryController.patch),
            ])
            .delete([
                catchAsync(validationMiddleware(validate.update)),
                catchAsync(memoryController.delete),
            ]);

        return this.app;
    }
}
