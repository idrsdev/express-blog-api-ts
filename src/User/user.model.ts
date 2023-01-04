import bcrypt from 'bcrypt';
import { Document, Model, Schema, model } from 'mongoose';

export interface IUser {
    email: string;
    name: string;
    password: string;
    role: string;
    isVerified: boolean;
}

// Put all user instance methods in this interface:
interface IUserMethods {
    matchPassword(password: string): Promise<Error | boolean>;
}

// Create a new Model type that knows about IUserMethods...
// Model<IUser, {}, IUserMethods>
// type UserModel = ;

interface UserModel
    extends Model<IUser, Record<string, unknown>, IUserMethods> {
    myStaticMethod(): number;
}

export type IUserDoc = IUser & Document;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isVerified: { type: Boolean, default: false },
        role: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.methods.matchPassword = async function (
    this: IUser,
    enteredPassword: string
): Promise<Error | boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default model<IUser, UserModel>('User', UserSchema);
