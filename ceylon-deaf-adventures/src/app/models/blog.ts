/**
 * Blog model used by admin panel to publish posts to frontend.
 */
export interface Blog {
    id?: string;
    title: string;
    summary?: string;
    content: string; // markdown or HTML
    slug?: string;
    tags?: string[];
    authorId: string;
    authorName?: string;
    status: 'draft' | 'published' | 'archived';
    featuredImage?: string; // URL
    isFeatured?: boolean;
    allowComments?: boolean;

    // analytics / counts
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;

    // timestamps (Firestore Timestamp)
    createdAt?: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
    publishedAt?: any; // Firestore Timestamp

    // SEO metadata
    meta?: {
        seoTitle?: string;
        seoDescription?: string;
    };

    // admin-only notes
    adminNotes?: string;
}

/**
 * Create a Blog object filling sensible defaults.
 */
export function createBlog(partial: Partial<Blog>): Omit<Blog, 'id'> {
    return {
        title: (partial.title || '').trim(),
        summary: partial.summary?.trim() || '',
        content: partial.content || '',
        slug: partial.slug || (partial.title ? slugify(partial.title) : ''),
        tags: partial.tags || [],
        authorId: partial.authorId || '',
        authorName: partial.authorName || '',
        status: partial.status || 'draft',
        featuredImage: partial.featuredImage || '',
        isFeatured: !!partial.isFeatured,
        allowComments: partial.allowComments !== undefined ? partial.allowComments : true,
        viewCount: partial.viewCount ?? 0,
        likeCount: partial.likeCount ?? 0,
        commentCount: partial.commentCount ?? 0,
        createdAt: partial.createdAt ?? undefined,
        updatedAt: partial.updatedAt ?? undefined,
        publishedAt: partial.publishedAt ?? null,
        meta: partial.meta || {},
        adminNotes: partial.adminNotes || '',
    };
}

/**
 * Validate minimal requirements for publishing.
 * Returns an array of error messages (empty => valid).
 */
export function validateBlog(partial: Partial<Blog>): string[] {
    const errors: string[] = [];
    if (!partial.title || !partial.title.trim()) errors.push('Title is required.');
    if (!partial.content || !partial.content.trim()) errors.push('Content is required.');
    if (!partial.authorId || !partial.authorId.trim()) errors.push('authorId is required.');
    return errors;
}

/**
 * Simple slug generator.
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
