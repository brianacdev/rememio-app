import { userCRUD } from '~~/server/crud'
import { userSchema } from '~~/server/schemas/app.schema'
import { mapper } from '~~/server/utils/mapper.util'

export default defineEventHandler(async (event) => {
    const { userId } = await requireAuthenticated(event)

    try {
        const [userData, userMemorialsData] = await Promise.all([
            userCRUD.query.getUserRequired(userId),
            userCRUD.query.getUserMemorials(userId),
        ])
        return {
            user: userSchema.parse(userData),
            memorials: mapper.mapUserMemorials(userMemorialsData),
        }
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch user profile',
        })
    }
})
