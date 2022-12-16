import { Document, Model } from 'mongoose';

interface IUser {
    email: string;
    name: string;
    password: string;
    role: string;
}

// Put all user instance methods in this interface:
interface IUserMethods {
    isValidPassword(password: string): Promise<Error | boolean>;
    fullName(): string;
}

// Create a new Model type that knows about IUserMethods...
// Model<IUser, {}, IUserMethods>
// type UserModel = ;

interface UserModel
    extends Model<IUser, Record<string, unknown>, IUserMethods> {
    myStaticMethod(): number;
}

interface IUserLogin {
    email: string;
    password: string;
}

type IUserDoc = IUser & Document;

export { IUser, IUserDoc, UserModel, IUserLogin, IUserMethods };
