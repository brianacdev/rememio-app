import { createError } from 'h3'
import type { InferInsertModel } from 'drizzle-orm'

import { db, tables } from '~~/server/db'
import { getRandomString } from '~~/server/utils/string.util'
import { oneOrNullAsync } from '~~/shared/utils/array.util'
import { funcs } from '~~/server/utils/drizzle.util'

const _getPhotoId = async (numAttempts: number = 10) => {
    let length = 6
    for (let i = 0; i < numAttempts; i++) {
        const photoId = getRandomString(length, 'photo')
        const photoCount = await db.$count(tables.photos, funcs.eq(tables.photos.photoId, photoId))

        if (photoCount === 0) {
            return photoId
        }

        if (i % 4 === 0) {
            length++
        }
    }

    throw createError({
        statusCode: 500,
        message: 'Failed to generate photo id',
    })
}

export const photoCRUD = {
    query: {
        getPhotoId: _getPhotoId,

        getPhotoStorageInfo: async (photoId: string) => {
            const storageInfo = await oneOrNullAsync(
                db
                    .select({
                        storageLocation: tables.photos.storageLocation,
                        storageKey: tables.photos.storageKey,
                    })
                    .from(tables.photos)
                    .where(funcs.eq(tables.photos.photoId, photoId))
            )

            return storageInfo
        },
    },
    mutate: {
        createPhoto: async (
            photoData: InferInsertModel<typeof tables.photos>,
            memorialId?: string,
            postId?: number
        ) => {
            if (!photoData.photoId) {
                photoData.photoId = await _getPhotoId()
            }
            await db.insert(tables.photos).values(photoData)
            if (memorialId) {
                await db.insert(tables.memorialPhotos).values({
                    memorialId,
                    photoId: photoData.photoId,
                    postId,
                    createdBy: photoData.createdBy,
                })
            }
            return photoData.photoId
        },
    },
}
