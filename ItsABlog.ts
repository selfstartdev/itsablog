import { ItsABlogOptions } from './types/ItsABlog';

export default class ItsABlog {
    constructor(options: ItsABlogOptions) {
        console.log('test');
    }
}

const itsABlog = new ItsABlog();