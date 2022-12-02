import postModel from '@/resources/post/post.model';
import { IPostDoc } from '@/resources/post/post.interface';

class PostService {
    private post = postModel;

    /**
     * Create a new post
     */
    public async create(title: string, body: string): Promise<IPostDoc | void> {
        try {
            const post = await this.post.create({ title, body });
            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }
}

export default PostService;
