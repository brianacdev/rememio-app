import { serveFileFromLocal } from '~~/server/utils/file.util'
import { memorialCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
	const memorialId = getRouterParam(event, 'memorialId')

	if (!memorialId) {
		throw createError({ statusCode: 400, message: 'Memorial ID is required' })
	}

	const coverPhoto = await memorialCRUD.query.getMemorialCoverPhoto(memorialId)

	if (!coverPhoto) {
		throw createError({ statusCode: 404, message: 'Memorial cover photo not found' })
	}

	if (coverPhoto.isDeleted) {
		throw createError({ statusCode: 404, message: 'Memorial cover photo not found' })
	}

	if (coverPhoto.storageLocation !== 'local') {
		throw createError({ statusCode: 404, message: 'Not implemented' })
	}

	return serveFileFromLocal(event, coverPhoto.storageKey, coverPhoto.contentType)
})
