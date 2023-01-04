import { HydratedDocument } from 'mongoose';
import jwtToken from '@/common/utils/jwtToken';
import userModel, { IUser } from '@/User/user.model';
import { AuthenticatedUserI } from '@/User/user.interface';
import HttpException from '@/common/exceptions/http.exception';
class UserService {
    private user = userModel;

    public async registerUserService(
        name: string,
        email: string,
        password: string,
        role = 'user'
    ): Promise<AuthenticatedUserI | HttpException> {
        const userExists = await this.user.findOne({ email });

        if (userExists) {
            return new HttpException(400, 'Unable to create user');
        }

        try {
            const user: HydratedDocument<IUser> = await this.user.create({
                name,
                email,
                password,
                role,
            });

            return {
                statusCode: 200,
                data: {
                    user,
                    token: jwtToken.createToken(user._id),
                },
            };
        } catch (error) {
            return new HttpException(400, 'Unable to create user');
        }
    }

    public async authenticateUserService(
        email: string,
        password: string
    ): Promise<HttpException | AuthenticatedUserI> {
        const user = await this.user.findOne({ email }).select('+password');

        if (!user) {
            return new HttpException(400, 'Invalid email or password');
        }

        if (!user.isVerified) {
            return new HttpException(403, 'Verify your Account');
        }

        if (!(await user.matchPassword(password))) {
            return new HttpException(400, 'Invalid username or password');
        }

        return {
            statusCode: 200,
            data: {
                user,
                token: jwtToken.createToken(user._id),
            },
        };
    }
}

export default UserService;
