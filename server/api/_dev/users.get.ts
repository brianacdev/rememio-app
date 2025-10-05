import { userCRUD } from '~~/server/crud/user.crud'

export default defineEventHandler(async (event) => {
    if (!import.meta.dev) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }

    try {
        const users = await userCRUD.query.getAllUsers()
        return { users }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch users',
        })
    }
})
