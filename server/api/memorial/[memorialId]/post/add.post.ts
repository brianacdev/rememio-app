import { readMultipartFormData, createError, defineEventHandler } from 'h3'
import { imageSize } from 'image-size'

import { requireViewMemorial } from '~~/server/utils/access.util'
import { storeFileLocal, UploadedFileLike } from '~~/server/utils/file.util'
import { photoCRUD, memorialCRUD } from '~~/server/crud'
import env from '~~/server/env'
import type { PhotoInsert } from '~~/server/types/db.type'
import type { PhotoMetadata } from '~~/server/utils/img.util'

export default defineEventHandler(async (event) => {
    const { userId, memorialId } = await requireViewMemorial(event)
    const multipartData = await readMultipartFormData(event)

    const contentData = multipartData?.find((d) => d.name === 'content')
    const files = multipartData?.filter((d) => d.name === 'photos[]' && d.filename) ?? []

    const hasContent = contentData && Buffer.isBuffer(contentData.data) && contentData.data.length > 0
    const hasPhotos = files.length > 0

    if (!hasContent && !hasPhotos) {
        throw createError({ statusCode: 400, message: 'Post must have content and/or at least one photo.' })
    }

    const content = hasContent ? contentData.data.toString('utf-8') : ''
    const newPostId = await memorialCRUD.mutate.createPost(memorialId, userId, content)

    if (hasPhotos) {
        for (const file of files) {
            const fileData = file.data
            if (!fileData || !Buffer.isBuffer(fileData)) continue

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
                height: fileLike.height,
                width: fileLike.width,
                orientation: fileLike.orientation,
                size: fileLike.size,
            } satisfies PhotoInsert

            await photoCRUD.mutate.createPhoto(photoData, memorialId, newPostId)
        }
    }

    return { success: true, postId: newPostId }
})
