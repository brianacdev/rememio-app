import { userCRUD } from '~~/server/crud/user.crud'
import { setAuthSessionData } from '~~/server/utils/session.util'

export default defineEventHandler(async (event) => {
    if (!import.meta.dev) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        })
    }

    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required',
        })
    }

    try {
        const user = await userCRUD.query.getUserRequired(userId)

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found',
            })
        }

        if (user.isBanned) {
            throw createError({
                statusCode: 403,
                statusMessage: 'User is banned',
            })
        }

        await setAuthSessionData(event, {
            status: 'authenticated',
            userId: user.userId,
            data: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                photoId: user.photoId,
                role: user.role,
            },
            secure: {
                accessToken: 'fake-access-token',
                refreshToken: 'fake-refresh-token',
            },
        } satisfies AuthSessionAuthenticatedSecure)

        return sendRedirect(event, '/profile')
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create session',
        })
    }
})
