import { memorialCRUD, memorialUserCRUD } from '~~/server/crud'
import { mapper } from '~~/server/utils/mapper.util'
import { memorialSchema } from '~~/server/schemas/app.schema'

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    try {
        const [memorialData, userContextData, memorialUsersData] = await Promise.all([
            memorialCRUD.query.getMemorial(memorialId),
            memorialUserCRUD.query.getMemorialUserContext(memorialId, userId),
            memorialUserCRUD.query.getMemorialUsers(memorialId),
        ])
        if (!memorialData) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Memorial not found',
            })
        }
        if (!userContextData) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User context not found',
            })
        }
        return {
            memorial: memorialSchema.parse(memorialData),
            userContext: mapper.mapMemorialUserContext(userContextData),
            memorialUsers: mapper.mapMemorialUsers(memorialUsersData),
        }
    } catch (error) {
        console.error('get memorial index error', error)
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch memorial',
        })
    }
})
