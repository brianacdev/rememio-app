import { memorialUserCRUD } from '~~/server/crud/memorial-user.crud'
import { memorialCRUD } from '~~/server/crud/memorial.crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const photoId = getRouterParam(event, 'photoId')
    if (!photoId) {
        throw createError({ statusCode: 400, message: 'Photo ID is required' })
    }

    const [photoData, userContextData, memorialUsersData] = await Promise.all([
        memorialCRUD.query.getMemorialPhoto(memorialId, photoId),
        memorialUserCRUD.query.getMemorialUserContext(memorialId, userId),
        memorialUserCRUD.query.getMemorialUsers(memorialId),
    ])
    return {
        photo: mapper.mapMemorialPhoto(photoData),
        userContext: mapper.mapMemorialUserContext(userContextData),
        memorialUsers: mapper.mapMemorialUsers(memorialUsersData),
    }
})
