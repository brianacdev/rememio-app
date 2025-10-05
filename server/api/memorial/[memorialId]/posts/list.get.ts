import { memorialCRUD, memorialUserCRUD } from '~~/server/crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId } = await requireViewMemorial(event)

    const [memorialPostsData, memorialUsersData] = await Promise.all([
        memorialCRUD.query.getMemorialPosts(memorialId),
        memorialUserCRUD.query.getMemorialUsers(memorialId),
    ])

    return {
        posts: mapper.mapMemorialPostList(memorialPostsData),
        memorialUsers: mapper.mapMemorialUsers(memorialUsersData),
    }
})
