import { memorialUserCRUD } from '~~/server/crud/memorial-user.crud'
import { memorialCRUD } from '~~/server/crud/memorial.crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const routePostId = getRouterParam(event, 'postId')
    if (!routePostId) {
        throw createError({ statusCode: 400, message: 'Post ID is required' })
    }
    const postId = Number(routePostId)
    if (!Number.isFinite(postId)) {
        throw createError({ statusCode: 400, message: 'Post ID must be a number' })
    }

    const [memorialData, userContextData, memorialUsersData] = await Promise.all([
        memorialCRUD.query.getMemorialPost(memorialId, postId),
        memorialUserCRUD.query.getMemorialUserContext(memorialId, userId),
        memorialUserCRUD.query.getMemorialUsers(memorialId),
    ])
    return {
        post: mapper.mapMemorialPost(memorialData),
        userContext: mapper.mapMemorialUserContext(userContextData),
        memorialUsers: mapper.mapMemorialUsers(memorialUsersData),
    }
})
