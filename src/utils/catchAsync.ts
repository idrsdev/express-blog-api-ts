import { Request, Response, NextFunction } from 'express';

type fn = (req: Request, res: Response, next?: NextFunction) => void;

const catchAsync =
    (fn: fn) => (req: Request, res: Response, next?: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next && next(err));
    };

export default catchAsync;
