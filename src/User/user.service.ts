import userModel from '@/User/user.model';
import token from '@/utils/token';
import { HydratedDocument } from 'mongoose';
import { IUser } from '@/User/user.interface';

class UserService {
    private user = userModel;

    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user: HydratedDocument<IUser> = await this.user.create({
                name,
                email,
                password,
                role,
            });

            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('No user with given email found');
            }
            if (!(await user.isValidPassword(password))) {
                throw new Error('Wrong credentials provided');
            }
            return token.createToken(user);
        } catch (error) {
            throw new Error('Unable to login user');
        }
    }
}

export default UserService;
