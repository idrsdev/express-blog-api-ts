import { IUser } from '@/User/user.model';

export interface AuthenticatedUserI {
    statusCode: number;
    data?: { token: string; user: IUser };
}
