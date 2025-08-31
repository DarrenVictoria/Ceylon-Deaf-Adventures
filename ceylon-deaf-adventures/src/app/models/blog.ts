// import {

// // /d:/Ceylon-Deaf-Adventures/ceylon-deaf-adventures/src/app/models/blog.ts
//     DocumentData,
//     QueryDocumentSnapshot,
//     DocumentSnapshot,
//     serverTimestamp,
//     Timestamp,
// } from 'firebase/firestore';

// /**
//  * Blog model used by admin panel to publish posts to frontend.
//  */
// export interface Blog {
//     id?: string;
//     title: string;
//     summary?: string;
//     content: string; // markdown or HTML
//     slug?: string;
//     tags?: string[];
//     authorId: string;
//     authorName?: string;
//     status: 'draft' | 'published' | 'archived';
//     featuredImage?: string; // URL
//     isFeatured?: boolean;
//     allowComments?: boolean;

//     // analytics / counts
//     viewCount?: number;
//     likeCount?: number;
//     commentCount?: number;

//     // timestamps (Firestore Timestamp)
//     createdAt?: Timestamp | null;
//     updatedAt?: Timestamp | null;
//     publishedAt?: Timestamp | null;

//     // SEO metadata
//     meta?: {
//         seoTitle?: string;
//         seoDescription?: string;
//     };

//     // admin-only notes
//     adminNotes?: string;
// }

// /**
//  * Create a Blog object filling sensible defaults.
//  * Note: createdAt/updatedAt left undefined so toFirestore can set serverTimestamp when writing.
//  */
// export function createBlog(partial: Partial<Blog>): Blog {
//     const now = undefined; // intentionally leave timestamps undefined so Firestore serverTimestamp is used
//     return {
//         title: (partial.title || '').trim(),
//         summary: partial.summary?.trim() || '',
//         content: partial.content || '',
//         slug: partial.slug || (partial.title ? slugify(partial.title) : undefined),
//         tags: partial.tags || [],
//         authorId: partial.authorId || '',
//         authorName: partial.authorName || '',
//         status: partial.status || 'draft',
//         featuredImage: partial.featuredImage || '',
//         isFeatured: !!partial.isFeatured,
//         allowComments: partial.allowComments !== undefined ? partial.allowComments : true,
//         viewCount: partial.viewCount ?? 0,
//         likeCount: partial.likeCount ?? 0,
//         commentCount: partial.commentCount ?? 0,
//         createdAt: partial.createdAt ?? now,
//         updatedAt: partial.updatedAt ?? now,
//         publishedAt: partial.publishedAt ?? null,
//         meta: partial.meta || {},
//         adminNotes: partial.adminNotes || '',
//         id: partial.id,
//     };
// }

// /**
//  * Convert a Blog to Firestore-friendly DocumentData.
//  * Will set server timestamps for createdAt/updatedAt when missing.
//  */
// export function toFirestore(blog: Blog): DocumentData {
//     return {
//         title: blog.title,
//         summary: blog.summary || null,
//         content: blog.content,
//         slug: blog.slug || slugify(blog.title),
//         tags: blog.tags || [],
//         authorId: blog.authorId,
//         authorName: blog.authorName || null,
//         status: blog.status,
//         featuredImage: blog.featuredImage || null,
//         isFeatured: !!blog.isFeatured,
//         allowComments: blog.allowComments !== undefined ? blog.allowComments : true,
//         viewCount: blog.viewCount ?? 0,
//         likeCount: blog.likeCount ?? 0,
//         commentCount: blog.commentCount ?? 0,
//         createdAt: blog.createdAt ?? serverTimestamp(),
//         updatedAt: blog.updatedAt ?? serverTimestamp(),
//         publishedAt: blog.publishedAt ?? null,
//         meta: blog.meta || {},
//         adminNotes: blog.adminNotes || null,
//     };
// }

// /**
//  * Build a Blog instance from a Firestore document snapshot.
//  */
// export function fromFirestore(
//     snap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
// ): Blog {
//     const data = snap.data() || {};
//     return {
//         id: snap.id,
//         title: data.title || '',
//         summary: data.summary || '',
//         content: data.content || '',
//         slug: data.slug || (data.title ? slugify(data.title) : ''),
//         tags: (data.tags as string[]) || [],
//         authorId: data.authorId || '',
//         authorName: data.authorName || '',
//         status: (data.status as Blog['status']) || 'draft',
//         featuredImage: data.featuredImage || '',
//         isFeatured: !!data.isFeatured,
//         allowComments: data.allowComments !== undefined ? !!data.allowComments : true,
//         viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
//         likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
//         commentCount: typeof data.commentCount === 'number' ? data.commentCount : 0,
//         createdAt: (data.createdAt as Timestamp) || null,
//         updatedAt: (data.updatedAt as Timestamp) || null,
//         publishedAt: (data.publishedAt as Timestamp) || null,
//         meta: data.meta || {},
//         adminNotes: data.adminNotes || '',
//     };
// }

// /**
//  * Validate minimal requirements for publishing.
//  * Returns an array of error messages (empty => valid).
//  */
// export function validateBlog(partial: Partial<Blog>): string[] {
//     const errors: string[] = [];
//     if (!partial.title || !partial.title.trim()) errors.push('Title is required.');
//     if (!partial.content || !partial.content.trim()) errors.push('Content is required.');
//     if (!partial.authorId || !partial.authorId.trim()) errors.push('authorId is required.');
//     if (partial.status === 'published') {
//         if (!partial.publishedAt) {
//             // publishing without a publishedAt is allowed; can be set server-side, so no error.
//         }
//     }
//     return errors;
// }

// /**
//  * Simple slug generator.
//  */
// export function slugify(text: string): string {
//     return text
//         .toLowerCase()
//         .trim()
//         .replace(/[\s\W-]+/g, '-')
//         .replace(/^-+|-+$/g, '');
// }