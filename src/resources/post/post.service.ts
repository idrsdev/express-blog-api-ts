import postModel from '@/resources/post/post.model';
import { IPost, IPostDoc } from '@/resources/post/post.interface';
import { HydratedDocument, Types } from 'mongoose';

class PostService {
    private post = postModel;

    /**
     * Create a new post
     */
    public async create(
        title: string,
        body: string
    ): Promise<IPostDoc | Error> {
        try {
            const post = await this.post.create({ title, body });
            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }

    /**
     * update a post
     */
    public async patch(
        id: Types.ObjectId,
        fieldsToUpdate: Partial<IPost>
    ): Promise<IPostDoc | Error> {
        const updatedPost: HydratedDocument<IPost> | null =
            await this.post.findOneAndUpdate(id, fieldsToUpdate, {
                new: true,
            });

        if (updatedPost) {
            return updatedPost;
        }

        throw new Error('Unable to update a post');
    }

    /**
     * delete a post
     */
    public async delete(id: Types.ObjectId): Promise<IPostDoc | Error> {
        const deletedPost: HydratedDocument<IPost> | null =
            await this.post.findByIdAndRemove(id);

        if (deletedPost) {
            return deletedPost;
        }
        throw new Error('Failed to delete post');
    }
}

export default PostService;
