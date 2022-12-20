import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

import { IUser, UserModel, IUserMethods } from '@/User/user.interface';

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
        },
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

UserSchema.methods.isValidPassword = async function (
    this: IUser,
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IUser, UserModel>('User', UserSchema);
