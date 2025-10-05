import { serveFileFromLocal } from '~~/server/utils/file.util'
import { userCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
	const userId = getRouterParam(event, 'userId')

	if (!userId) {
		throw createError({ statusCode: 400, message: 'User ID is required' })
	}

	const photo = await userCRUD.query.getUserPhoto(userId)

	if (!photo) {
		throw createError({ statusCode: 404, message: 'User photo not found' })
	}

	if (!photo || photo.isDeleted) {
		throw createError({ statusCode: 404, message: 'Photo not found' })
	}

	if (photo.storageLocation !== 'local') {
		throw createError({ statusCode: 404, message: 'Not implemented' })
	}

	return serveFileFromLocal(event, photo.storageKey, photo.contentType)
})
