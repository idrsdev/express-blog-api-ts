import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import express, { Application } from 'express';

import { UserRoutes } from '@/User/user.route.config';
import { MemoryRoutes } from '@/Memory/memory.route.config';
import { RouteConfig } from '@/common/common.route.config';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
    public express: Application;
    public port: number;

    constructor(routes: RouteConfig[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseRoutes();
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    // ['UserRoutes', 'PostRoutes']
    // TODO: pass these RouteConfig[] as a string and create their instance
    private initialiseRoutes(): void {
        new UserRoutes(this.express);
        new MemoryRoutes(this.express);
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        mongoose
            .connect(`${process.env.MONGO_URI || ''}`)
            .then((conn) => {
                console.log(`MongoDB Connected: ${conn.connection.host}`);
            })
            .catch((error) => {
                console.error(`Error: ${(error as Error).message}`);
                process.exit(1);
            });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
