import { imageSize } from 'image-size'

import { memorialCRUD, photoCRUD } from '~~/server/crud'
import env from '~~/server/env'
import type { PhotoInsert } from '~~/server/types/db.type'
import { storeFileLocal } from '~~/server/utils/file.util'
import { getImageOrientation, type PhotoMetadata } from '~~/server/utils/img.util'

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireEditMemorial(event)

    const multipartData = await readMultipartFormData(event)
    const profilePhoto = multipartData?.find((d) => d.name === 'profile' && d.filename)
    const coverPhoto = multipartData?.find((d) => d.name === 'cover' && d.filename)

    if (!profilePhoto && !coverPhoto) {
        throw createError({ statusCode: 400, message: 'No photo provided' })
    }

    const photoType = profilePhoto ? 'profile' : 'cover'
    const file = profilePhoto ?? coverPhoto
    if (!file) {
        throw createError({ statusCode: 400, message: 'No photo provided' })
    }

    const fileData = file.data

    if (!fileData || !Buffer.isBuffer(fileData)) {
        throw createError({ statusCode: 400, message: 'Invalid file data' })
    }

    try {
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
            memorialId,
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

        await photoCRUD.mutate.createPhoto(photoData, memorialId)
        if (photoType === 'profile') {
            await memorialCRUD.mutate.updateMemorialProfilePhoto(memorialId, photoId)
        } else {
            await memorialCRUD.mutate.updateMemorialCoverPhoto(memorialId, photoId)
        }
        setResponseStatus(event, 204)
    } catch (error) {
        console.error('Error updating photo:', error)
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update photo',
        })
    }
})
