import { Schema, model } from 'mongoose';
import { IPost } from '@/resources/post/post.interface';

const PostSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<IPost>('Post', PostSchema);
