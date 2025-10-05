import { memorialUserCRUD } from '~~/server/crud'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    try {
        const userContextData = await memorialUserCRUD.query.getMemorialUserContext(memorialId, userId)
        if (!userContextData) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User context not found',
            })
        }
        return {
            userContext: mapper.mapMemorialUserContext(userContextData),
        }
    } catch (error) {
        console.error('get memorial user context error', error)
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch memorial user context',
        })
    }
})
