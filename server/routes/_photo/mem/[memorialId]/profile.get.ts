import { serveFileFromLocal } from '~~/server/utils/file.util'
import { memorialCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
    const memorialId = getRouterParam(event, 'memorialId')

    if (!memorialId) {
        throw createError({ statusCode: 400, message: 'Memorial ID is required' })
    }

    const profilePhoto = await memorialCRUD.query.getMemorialProfilePhoto(memorialId)

    if (!profilePhoto) {
        throw createError({ statusCode: 404, message: 'Memorial profile photo not found' })
    }

    if (profilePhoto.isDeleted) {
        throw createError({ statusCode: 404, message: 'Memorial profile photo not found' })
    }

    if (profilePhoto.storageLocation !== 'local') {
        throw createError({ statusCode: 404, message: 'Not implemented' })
    }

    return serveFileFromLocal(event, profilePhoto.storageKey, profilePhoto.contentType)
})
