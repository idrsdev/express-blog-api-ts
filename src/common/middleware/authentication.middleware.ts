import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import userModel from '@/User/user.model';
import Token from '@/interfaces/token.interface';
import { verifyToken } from '@/common/utils/jwtToken';
import HttpException from '@/exceptions/http.exception';

async function authenticatedMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        next(new HttpException(401, 'Unauthorized'));
        return;
    }

    const accessToken = bearer?.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.VerifyErrors = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return;
        }

        const user = await userModel.findById(payload.id).select('-password');

        if (!user) {
            next(new HttpException(401, 'Unauthorized'));
            return;
        }
        req.user = user;

        next();
    } catch (error) {
        console.log('error', error);

        if (error instanceof jwt.TokenExpiredError) {
            next(new HttpException(401, 'Unauthorized, Login again'));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            next(new HttpException(401, 'Invalid session token'));
        }
        next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticatedMiddleware;
