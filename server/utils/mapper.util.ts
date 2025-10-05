import { z } from 'zod/v4'
import type {
    GetMemorialPhotoResults,
    GetMemorialUsersResults,
    GetMemorialPhotosResults,
    GetMemorialPostsResults,
    GetMemorialPostResults,
    GetMemorialUserContextResults,
    GetUserMemorialsResult,
} from '~~/server/types/crud.type'
import {
    photoSchema,
    userSimpleSchema,
    photoCommentSchema,
    postCommentSchema,
    memorialUserSchema,
    memorialPhotoSchema,
    postSchema,
    userSchema,
    memorialSchema,
} from '~~/server/schemas/app.schema'
import { getMemorialPhotoUrl } from '~~/shared/utils/photo.util'

function mapMemorialUser(mu: GetMemorialUsersResults[number]) {
    const memorialUser = memorialUserSchema.parse(mu.memorialUser)
    const user = userSimpleSchema.parse(mu.user)
    return {
        user,
        fullName: user.fullName,
        photoUrl: user.photoUrl,
        initials: user.initials,
        ...memorialUser,
    }
}

function mapMemorialUsers(memorialUsersResults: GetMemorialUsersResults) {
    return memorialUsersResults.map(mapMemorialUser)
}

function mapMemorialPhoto(memorialPhotoResults: GetMemorialPhotoResults) {
    const firstResult = memorialPhotoResults[0]
    if (!firstResult) {
        throw new Error('Memorial photo not found')
    }
    const photo = photoSchema.parse(firstResult.photo)
    const memorialPhoto = memorialPhotoSchema.parse(firstResult.memorialPhoto)
    const comments = reduceComments(memorialPhotoResults.map((r) => r.comment))
        .map((r) => photoCommentSchema.parse(r))
        .sort((a, b) => a.createdAtSort - b.createdAtSort)
    const reactions = memorialPhotoResults.filter((r) => r.reaction !== null).map((r) => r.reaction!)
    return {
        photo,
        comments,
        commentCount: comments.length,
        reactions,
        ...memorialPhoto,
        photoUrl: getMemorialPhotoUrl(memorialPhoto.memorialId, photo.photoId),
    }
}
type MapMemorialPhoto = ReturnType<typeof mapMemorialPhoto>

function mapMemorialPhotoList(memorialPhotos: GetMemorialPhotosResults) {
    return memorialPhotos.reduce((acc, r) => {
        const photoId = r.photo.photoId
        if (!acc.some((p) => p.photoId === photoId)) {
            const photoResults = memorialPhotos.filter((r) => r.photo.photoId === photoId)
            acc.push(mapMemorialPhoto(photoResults))
        }
        return acc
    }, new Array<MapMemorialPhoto>())
}

const postPhotoSchema = z.object({
    ...photoSchema.shape,
    photoUrl: z.string(),
})

function reduceComments<T extends { commentId: number }>(comments: (T | null)[]): T[] {
    return comments.reduce((acc, r) => {
        if (r?.commentId && !acc.some((c) => c.commentId === r.commentId)) {
            acc.push(r)
        }
        return acc
    }, [] as T[])
}

function reducePostPhotos<T extends { photoId: string }>(photos: (T | null)[]): T[] {
    return photos.reduce((acc, r) => {
        if (r?.photoId && !acc.some((c) => c.photoId === r.photoId)) {
            acc.push(r)
        }
        return acc
    }, [] as T[])
}

function mapMemorialPost(memorialPost: GetMemorialPostResults) {
    const firstResult = memorialPost[0]
    if (!firstResult) {
        throw new Error('Memorial post not found')
    }
    const post = postSchema.parse(firstResult.post)
    const photos = reducePostPhotos(memorialPost.map((mp) => mp.photo))
        .map((p) =>
            postPhotoSchema.parse({
                ...p,
                photoUrl: getMemorialPhotoUrl(post.memorialId, p.photoId)!,
            })
        )
        .sort((a, b) => a.photoId.localeCompare(b.photoId))
    const comments = reduceComments(memorialPost.map((r) => r.comment))
        .map((r) => postCommentSchema.parse(r))
        .sort((a, b) => a.createdAtSort - b.createdAtSort)
    const reactions = memorialPost.filter((r) => r.reaction !== null).map((r) => r.reaction!)
    return {
        photos,
        photoCount: photos.length,
        comments,
        commentCount: comments.length,
        reactions,
        ...post,
    }
}

function mapMemorialPostList(memorialPosts: GetMemorialPostsResults) {
    const results = memorialPosts.reduce((acc, r) => {
        const postId = r.post.postId
        if (!acc.has(postId)) {
            const postResults = memorialPosts.filter((r) => r.post.postId === postId)
            acc.set(postId, mapMemorialPost(postResults))
        }
        return acc
    }, new Map<number, ReturnType<typeof mapMemorialPost>>())

    return Array.from(results.values())
}

function mapMemorialUserContext(memorialUserContext: GetMemorialUserContextResults) {
    if (!memorialUserContext) {
        throw new Error('Memorial user context not found')
    }
    const user = userSchema.parse(memorialUserContext.user)
    const memorialUser = memorialUserSchema.parse(memorialUserContext.memorialUser)
    return {
        user,
        ...memorialUser,
        isOwner: memorialUserContext.memorialOwner === user.userId,
    }
}

function mapUserMemorials(memorials: GetUserMemorialsResult) {
    return memorials.map((m) => {
        const { createdAt, userId, ...memorialUser } = memorialUserSchema.parse(m.memorialUser)
        const { owner, createdBy, isObituaryPublic, obituary, partnerId, ...memorial } = memorialSchema.parse(
            m.memorial
        )
        return {
            ...memorial,
            ...memorialUser,
            isOwner: owner === userId,
        }
    })
}

export const mapper = {
    mapMemorialUser,
    mapMemorialUsers,
    mapMemorialPhoto,
    mapMemorialPhotoList,
    mapMemorialPost,
    mapMemorialPostList,
    mapMemorialUserContext,
    mapUserMemorials,
}
