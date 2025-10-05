import type { H3Event } from 'h3'

import { accessCRUD } from '~~/server/crud'
import { isAuthSessionAuthenticated } from '~~/shared/utils/session.util'

export const requireAuthenticated = async (event: H3Event) => {
	const sessionData = await requireAuthSession(event)
	if (!sessionData || !isAuthSessionAuthenticated(sessionData)) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
		})
	}
	return {
		userId: sessionData.userId,
	}
}

export const requireViewMemorial = async (event: H3Event) => {
	const { userId } = await requireAuthenticated(event)

	const memorialId = getRouterParam(event, 'memorialId')
	if (!memorialId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Memorial ID is required',
		})
	}
	const canView = await accessCRUD.query.canViewMemorial(memorialId, userId)
	if (!canView) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Access denied',
		})
	}
	return {
		memorialId,
		userId,
	}
}

export const requireEditMemorial = async (event: H3Event) => {
	const { userId } = await requireAuthenticated(event)

	const memorialId = getRouterParam(event, 'memorialId')
	if (!memorialId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Memorial ID is required',
		})
	}
	const canEdit = await accessCRUD.query.canEditMemorial(memorialId, userId)
	if (!canEdit) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Access denied',
		})
	}
	return {
		memorialId,
		userId,
	}
}
