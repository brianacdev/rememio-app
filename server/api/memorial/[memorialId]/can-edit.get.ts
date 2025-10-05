import { accessCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
    const { userId } = await requireAuthenticated(event)
    const memorialId = getRouterParam(event, 'memorialId')
    if (!memorialId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Memorial ID is required',
        })
    }
    const canEdit = await accessCRUD.query.canEditMemorial(memorialId, userId)
    return {
        canEdit,
    }
})
