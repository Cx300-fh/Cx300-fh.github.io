export type Post = {slug:string;href:string;title:string;description:string;image:string;imageAlt:string;category:string;date:string;readingTime:string;tags:string[]};
// Add only posts that are ready to publish. Each href must lead to its article.
export const posts: Post[] = [];
