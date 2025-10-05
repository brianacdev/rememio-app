import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import { imageSize } from 'image-size'

import { storeFileLocal, UploadedFileLike } from '~~/server/utils/file.util'
import { photoCRUD, userCRUD } from '~~/server/crud'
import { getImageOrientation } from '~~/server/utils/img.util'
import env from '~~/server/env'
import type { PhotoInsert } from '~~/server/types/db.type'
import type { PhotoMetadata } from '~~/server/utils/img.util'

export default defineEventHandler(async (event) => {
    const { userId } = await requireAuthenticated(event)

    const multipartData = await readMultipartFormData(event)
    const files = multipartData?.filter((d) => d.name === 'photo' && d.filename) ?? []

    if (files.length === 0) {
        throw createError({ statusCode: 400, message: 'No photo file provided' })
    }

    if (files.length > 1) {
        throw createError({ statusCode: 400, message: 'Only one photo can be uploaded at a time' })
    }

    const file = files[0]
    const fileData = file.data

    if (!fileData || !Buffer.isBuffer(fileData)) {
        throw createError({ statusCode: 400, message: 'Invalid file data' })
    }

    const dim = imageSize(fileData)
    const contentType: string = dim.type ?? file.type ?? ''

    const photoId = await photoCRUD.query.getPhotoId()
    const filename = file.filename ?? photoId

    // Adapt to UploadedFileLike object for storeFileLocal
    const fileLike: UploadedFileLike = {
        photoId,
        name: filename,
        type: contentType,
        size: fileData.length,
        width: dim.width ?? null,
        height: dim.height ?? null,
        orientation: getImageOrientation(dim),
        async bytes() {
            return fileData
        },
    }

    const storageLocation = env.PHOTO_STORAGE_LOCATION
    let storageKey: string | null = null

    if (storageLocation === 'local') {
        storageKey = await storeFileLocal(fileLike, filename)
    } else {
        throw new Error('Not implemented... yet :(')
    }

    if (!storageKey) {
        throw createError({ statusCode: 500, message: 'Failed to store photo' })
    }

    const metadata = {
        userId,
        photoId,
        filename,
        size: fileLike.size,
        contentType,
        width: fileLike.width,
        height: fileLike.height,
        orientation: fileLike.orientation,
    } satisfies PhotoMetadata

    const photoData = {
        photoId,
        createdBy: userId,
        storageKey,
        storageLocation,
        metadata,
        filename,
        contentType,
    } satisfies PhotoInsert

    await photoCRUD.mutate.createPhoto(photoData)

    await userCRUD.mutate.updateUserPhoto(userId, photoId)

    return { success: true, photoId }
})
