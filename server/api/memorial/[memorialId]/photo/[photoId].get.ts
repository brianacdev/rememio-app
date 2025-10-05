import { memorialCRUD } from '~~/server/crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId } = await requireViewMemorial(event)
    const photoId = getRouterParam(event, 'photoId')
    if (!photoId) {
        throw createError({ statusCode: 400, message: 'Photo ID is required' })
    }

    const memorialPhotoResults = await memorialCRUD.query.getMemorialPhoto(memorialId, photoId)
    const photo = mapper.mapMemorialPhoto(memorialPhotoResults)

    return {
        photo,
    }
})
