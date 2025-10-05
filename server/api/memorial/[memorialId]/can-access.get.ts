import { accessCRUD } from '~~/server/crud'

export default defineEventHandler(async event => {
	const { userId } = await requireAuthenticated(event)
	const memorialId = getRouterParam(event, 'memorialId')
	if (!memorialId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Memorial ID is required',
		})
	}

	const canAccess = await accessCRUD.query.canViewMemorial(memorialId, userId)
	return {
		canAccess,
	}
})
