import { userCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
	const { userId } = await requireAuthenticated(event)

	try {
		const userMemorials = await userCRUD.query.getUserMemorials(userId)

		return {
			memorials: mapper.mapUserMemorials(userMemorials),
		}
	} catch (error) {
		if (error instanceof Error && 'statusCode' in error) {
			throw error
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch user memorials',
		})
	}
})
