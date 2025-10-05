import { createError } from 'h3'
import type { InferInsertModel } from 'drizzle-orm'
import { db, tables } from '~~/server/db'
import { getRandomString } from '~~/server/utils/string.util'
import { oneOrNullAsync, oneOrNullScalarAsync, oneAsync, oneScalarAsync } from '~~/shared/utils/array.util'
import { funcs } from '~~/server/utils/drizzle.util'

export type CreateMemorial = Omit<
    InferInsertModel<typeof tables.memorials>,
    'createdBy' | 'memorialId' | 'createdAt' | 'deletedAt' | 'deletedBy'
> & { memorialId?: string }

export type UpdateMemorial = Omit<
    Partial<CreateMemorial>,
    'memorialId' | 'owner' | 'createdBy' | 'deletedAt' | 'createdAt' | 'partnerId'
>

const _getMemorialId = async (numAttempts: number = 40) => {
    let length = 6
    for (let i = 0; i < numAttempts; i++) {
        const memorialId = getRandomString(length, 'memorial')
        const count = await db.$count(tables.memorials, funcs.eq(tables.memorials.memorialId, memorialId))
        if (count === 0) {
            return memorialId
        }

        if (i % 4 === 0) {
            length++
        }
    }

    throw createError({
        statusCode: 500,
        message: 'Failed to generate memorial id',
    })
}

export const memorialCRUD = {
    query: {
        isMemorialObituaryPublic: async (memorialId: string) => {
            return await oneScalarAsync(
                db
                    .select({
                        isObituaryPublic: tables.memorials.isObituaryPublic,
                    })
                    .from(tables.memorials)
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorials.memorialId, memorialId),
                            funcs.eq(tables.memorials.isDeleted, false)
                        )
                    )
            )
        },

        getMemorial: async (memorialId: string) => {
            return await oneAsync(
                db
                    .select()
                    .from(tables.memorials)
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorials.memorialId, memorialId),
                            funcs.eq(tables.memorials.isDeleted, false)
                        )
                    )
            )
        },

        getMemorialProfilePhoto: async (memorialId: string) => {
            const result = await oneOrNullAsync(
                db
                    .select({
                        photo: tables.photos,
                    })
                    .from(tables.photos)
                    .innerJoin(tables.memorials, funcs.eq(tables.memorials.profilePhotoId, tables.photos.photoId))
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorials.memorialId, memorialId),
                            funcs.eq(tables.memorials.isDeleted, false),
                            funcs.eq(tables.photos.isDeleted, false)
                        )
                    )
            )

            return result?.photo
        },

        getMemorialCoverPhoto: async (memorialId: string) => {
            const result = await oneOrNullAsync(
                db
                    .select({
                        photo: tables.photos,
                    })
                    .from(tables.photos)
                    .innerJoin(tables.memorials, funcs.eq(tables.memorials.coverPhotoId, tables.photos.photoId))
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorials.memorialId, memorialId),
                            funcs.eq(tables.memorials.isDeleted, false),
                            funcs.eq(tables.photos.isDeleted, false)
                        )
                    )
            )

            return result?.photo
        },

        getMemorialPosts: async (memorialId: string) => {
            return await db
                .select({
                    post: tables.posts,
                    photo: tables.photos,
                    memorialPhoto: tables.memorialPhotos,
                    comment: tables.comments,
                    reaction: tables.reactions.userId,
                })
                .from(tables.posts)
                .leftJoin(
                    tables.memorialPhotos,
                    funcs.and(
                        funcs.eq(tables.posts.postId, tables.memorialPhotos.postId),
                        funcs.eq(tables.memorialPhotos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.photos,
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.photoId, tables.photos.photoId),
                        funcs.eq(tables.photos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.comments,
                    funcs.and(
                        funcs.eq(tables.posts.postId, tables.comments.postId),
                        funcs.eq(tables.comments.isDeleted, false)
                    )
                )
                .leftJoin(tables.reactions, funcs.eq(tables.posts.postId, tables.reactions.postId))
                .where(funcs.eq(tables.posts.memorialId, memorialId))
                .orderBy(funcs.desc(tables.posts.createdAt))
        },

        getMemorialMemories: async (memorialId: string) => {
            return await db
                .select({
                    post: tables.posts,
                    photo: tables.photos,
                    comment: tables.comments,
                    reaction: tables.reactions.userId,
                })
                .from(tables.posts)
                .leftJoin(tables.memorialPhotos, funcs.eq(tables.posts.postId, tables.memorialPhotos.postId))
                .leftJoin(
                    tables.photos,
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.photoId, tables.photos.photoId),
                        funcs.eq(tables.photos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.comments,
                    funcs.and(
                        funcs.eq(tables.posts.postId, tables.comments.postId),
                        funcs.eq(tables.comments.isDeleted, false)
                    )
                )
                .leftJoin(tables.reactions, funcs.eq(tables.posts.postId, tables.reactions.postId))
                .where(
                    funcs.and(
                        funcs.eq(tables.posts.memorialId, memorialId),
                        funcs.sql`length(trim(coalesce(${tables.posts.content}, ''))) > 0`
                    )
                )
                .orderBy(funcs.desc(tables.posts.createdAt))
        },

        getMemorialPhotos: async (memorialId: string) => {
            return await db
                .select({
                    photo: tables.photos,
                    memorialPhoto: tables.memorialPhotos,
                    comment: tables.comments,
                    reaction: tables.reactions.userId,
                })
                .from(tables.photos)
                .innerJoin(
                    tables.memorialPhotos,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.memorialPhotos.photoId),
                        funcs.eq(tables.memorialPhotos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.comments,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.comments.photoId),
                        funcs.eq(tables.comments.memorialId, memorialId),
                        funcs.eq(tables.comments.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.reactions,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.reactions.photoId),
                        funcs.eq(tables.reactions.memorialId, memorialId)
                    )
                )
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.memorialId, memorialId),
                        funcs.eq(tables.photos.isDeleted, false)
                    )
                )
                .orderBy(funcs.desc(tables.memorialPhotos.createdAt))
        },

        getMemorialPhoto: async (memorialId: string, photoId: string) => {
            const results = await db
                .select({
                    photo: tables.photos,
                    memorialPhoto: tables.memorialPhotos,
                    comment: tables.comments,
                    reaction: tables.reactions.userId,
                })
                .from(tables.photos)
                .innerJoin(
                    tables.memorialPhotos,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.memorialPhotos.photoId),
                        funcs.eq(tables.memorialPhotos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.comments,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.comments.photoId),
                        funcs.eq(tables.comments.memorialId, memorialId),
                        funcs.eq(tables.comments.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.reactions,
                    funcs.and(
                        funcs.eq(tables.photos.photoId, tables.reactions.photoId),
                        funcs.eq(tables.reactions.memorialId, memorialId)
                    )
                )
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.memorialId, memorialId),
                        funcs.eq(tables.memorialPhotos.photoId, photoId),
                        funcs.eq(tables.photos.isDeleted, false)
                    )
                )

            return results
        },

        getMemorialPost: async (memorialId: string, postId: number) => {
            return await db
                .select({
                    post: tables.posts,
                    photo: tables.photos,
                    comment: tables.comments,
                    reaction: tables.reactions.userId,
                })
                .from(tables.posts)
                .leftJoin(tables.memorialPhotos, funcs.eq(tables.posts.postId, tables.memorialPhotos.postId))
                .leftJoin(
                    tables.photos,
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.photoId, tables.photos.photoId),
                        funcs.eq(tables.photos.isDeleted, false)
                    )
                )
                .leftJoin(
                    tables.comments,
                    funcs.and(
                        funcs.eq(tables.posts.postId, tables.comments.postId),
                        funcs.eq(tables.comments.isDeleted, false)
                    )
                )
                .leftJoin(tables.reactions, funcs.eq(tables.posts.postId, tables.reactions.postId))
                .where(funcs.and(funcs.eq(tables.posts.memorialId, memorialId), funcs.eq(tables.posts.postId, postId)))
        },

        getMemorialId: _getMemorialId,

        getOwnerUserId: async (memorialId: string) => {
            const owner = await oneOrNullScalarAsync(
                db
                    .select({
                        owner: tables.memorials.owner,
                    })
                    .from(tables.memorials)
                    .where(funcs.eq(tables.memorials.memorialId, memorialId))
            )
            return owner
        },

        memorialPhotoExists: async (memorialId: string, photoId: string): Promise<boolean> => {
            const count = await db.$count(
                tables.memorialPhotos,
                funcs.and(
                    funcs.eq(tables.memorialPhotos.memorialId, memorialId),
                    funcs.eq(tables.memorialPhotos.photoId, photoId)
                )
            )

            return count > 0
        },
    },

    mutate: {
        createMemorial: async (
            userId: string,
            memorialData: Omit<InferInsertModel<typeof tables.memorials>, 'id' | 'createdBy'> & {
                id?: string
            },
            isOwnerUserId: boolean
        ) => {
            let memorialId = memorialData.id
            if (!memorialId) {
                memorialId = await _getMemorialId()
            }

            const owner = isOwnerUserId ? userId : undefined

            await oneAsync(
                db.insert(tables.memorials).values({
                    ...memorialData,
                    owner,
                    memorialId,
                    createdBy: userId,
                })
            )
            if (isOwnerUserId) {
                await db
                    .insert(tables.memorialUsers)
                    .values({
                        memorialId,
                        userId,
                        role: 'admin',
                    })
                    .onConflictDoUpdate({
                        target: [tables.memorialUsers.memorialId, tables.memorialUsers.userId],
                        set: {
                            role: 'admin',
                        },
                    })
            }
            return memorialId
        },

        addMemorialPhotos: async (memorialId: string, photoIds: string[], createdBy: string, postId?: number) => {
            await db
                .insert(tables.memorialPhotos)
                .values(
                    photoIds.map(
                        (photoId) =>
                            ({
                                memorialId,
                                photoId,
                                createdBy,
                                postId,
                            }) satisfies InferInsertModel<typeof tables.memorialPhotos>
                    )
                )
                .onConflictDoUpdate({
                    target: [tables.memorialPhotos.memorialId, tables.memorialPhotos.photoId],
                    set: {
                        postId,
                    },
                })
        },

        updateMemorial: async (memorialId: string, updateValues: UpdateMemorial) => {
            return await db
                .update(tables.memorials)
                .set(updateValues)
                .where(funcs.eq(tables.memorials.memorialId, memorialId))
        },

        updateMemorialProfilePhoto: async (memorialId: string, photoId: string) => {
            const exists = await memorialCRUD.query.memorialPhotoExists(memorialId, photoId)
            if (!exists) {
                throw createError({
                    statusCode: 400,
                    message: 'Photo does not exist',
                })
            }
            return await db
                .update(tables.memorials)
                .set({ profilePhotoId: photoId })
                .where(funcs.eq(tables.memorials.memorialId, memorialId))
        },

        updateMemorialCoverPhoto: async (memorialId: string, photoId: string) => {
            const exists = await memorialCRUD.query.memorialPhotoExists(memorialId, photoId)
            if (!exists) {
                throw createError({
                    statusCode: 400,
                    message: 'Photo does not exist',
                })
            }
            return await db
                .update(tables.memorials)
                .set({ coverPhotoId: photoId })
                .where(funcs.eq(tables.memorials.memorialId, memorialId))
        },

        createPost: async (memorialId: string, userId: string, content: string) => {
            const postId = await oneScalarAsync(
                db
                    .insert(tables.posts)
                    .values({
                        memorialId,
                        content,
                        createdBy: userId,
                    })
                    .returning({ postId: tables.posts.postId })
            )

            return postId
        },

        togglePostReaction: async (memorialId: string, postId: number, userId: string) => {
            const reaction = await oneOrNullAsync(
                db
                    .select()
                    .from(tables.reactions)
                    .where(
                        funcs.and(funcs.eq(tables.reactions.postId, postId), funcs.eq(tables.reactions.userId, userId))
                    )
            )

            if (reaction) {
                await db
                    .delete(tables.reactions)
                    .where(
                        funcs.and(funcs.eq(tables.reactions.postId, postId), funcs.eq(tables.reactions.userId, userId))
                    )
                return false
            } else {
                await db.insert(tables.reactions).values({
                    postId,
                    memorialId,
                    userId,
                })
                return true
            }
        },

        togglePhotoReaction: async (memorialId: string, photoId: string, userId: string) => {
            const reaction = await oneOrNullAsync(
                db
                    .select()
                    .from(tables.reactions)
                    .where(
                        funcs.and(
                            funcs.eq(tables.reactions.photoId, photoId),
                            funcs.eq(tables.reactions.memorialId, memorialId),
                            funcs.eq(tables.reactions.userId, userId)
                        )
                    )
            )

            if (reaction) {
                await db
                    .delete(tables.reactions)
                    .where(
                        funcs.and(
                            funcs.eq(tables.reactions.photoId, photoId),
                            funcs.eq(tables.reactions.memorialId, memorialId),
                            funcs.eq(tables.reactions.userId, userId)
                        )
                    )
                return false
            } else {
                await db.insert(tables.reactions).values({
                    photoId,
                    memorialId,
                    userId,
                })
                return true
            }
        },

        addPhotoComment: async (memorialId: string, photoId: string, userId: string, content: string) => {
            await db.insert(tables.comments).values({
                memorialId,
                photoId,
                createdBy: userId,
                content,
            })
        },

        addPostComment: async (memorialId: string, postId: number, userId: string, content: string) => {
            await db.insert(tables.comments).values({
                memorialId,
                postId,
                createdBy: userId,
                content,
            })
        },
    },
}

export type GetMemorialResult = Awaited<ReturnType<typeof memorialCRUD.query.getMemorial>>
export type GetMemorialPostsResults = Awaited<ReturnType<typeof memorialCRUD.query.getMemorialPosts>>
export type GetMemorialPhotosResults = Awaited<ReturnType<typeof memorialCRUD.query.getMemorialPhotos>>
export type GetMemorialPhotoResults = Awaited<ReturnType<typeof memorialCRUD.query.getMemorialPhoto>>
export type GetMemorialPostResults = Awaited<ReturnType<typeof memorialCRUD.query.getMemorialPost>>
