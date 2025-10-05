import { userCRUD, updateUserNamesSchema } from '~~/server/crud'

export default defineEventHandler(async (event) => {
	const { userId } = await requireAuthenticated(event)
	const { firstName, lastName } = await readValidatedBody(event, updateUserNamesSchema.parse)

	try {
		await userCRUD.mutate.updateUserNames(userId, firstName, lastName)

		setResponseStatus(event, 204)
		return 'No Content'
	} catch (error) {
		if (error instanceof Error && 'statusCode' in error) {
			throw error
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to update user profile',
		})
	}
})
