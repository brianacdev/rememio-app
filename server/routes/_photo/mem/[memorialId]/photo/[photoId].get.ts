import { serveFileFromLocal } from '~~/server/utils/file.util'
import { memorialCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
	const { memorialId } = await requireViewMemorial(event)
	const photoId = getRouterParam(event, 'photoId')

	if (!photoId) {
		throw createError({ statusCode: 400, message: 'Photo ID is required' })
	}

	const memorialPhotoResults = await memorialCRUD.query.getMemorialPhoto(memorialId, photoId)
	if (!memorialPhotoResults || !memorialPhotoResults.length) {
		throw createError({ statusCode: 404, message: 'Photo not found' })
	}
	const firstResult = memorialPhotoResults[0]
	if (!firstResult) {
		throw createError({ statusCode: 404, message: 'Photo not found' })
	}

	if (firstResult.photo.isDeleted) {
		console.warn(`Photo ${photoId} is deleted`)
		throw createError({ statusCode: 404, message: 'Photo not found' })
	}

	if (firstResult.memorialPhoto.isDeleted) {
		console.warn(`MemorialPhoto ${photoId} is deleted`)
		throw createError({ statusCode: 404, message: 'Photo not found' })
	}

	if (firstResult.photo.storageLocation !== 'local') {
		throw createError({ statusCode: 404, message: 'Not implemented' })
	}

	return serveFileFromLocal(event, firstResult.photo.storageKey, firstResult.photo.contentType)
})
