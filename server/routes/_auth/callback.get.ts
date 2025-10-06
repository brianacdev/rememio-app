import { workos } from '~~/server/utils/auth.util'
import { nanoid } from 'nanoid'
import env from '~~/server/env'
import { setAuthSessionData } from '~~/server/utils/session.util'
import { isAuthStateSessionData } from '~~/shared/utils/session.util'
import { userCRUD } from '~~/server/crud'

export default defineEventHandler(async (event) => {
    const query = getQuery<
        { code: string; state: string } | { error: string; error_description: string; state: string }
    >(event)
    if ('error' in query) {
        throw createError({
            statusCode: 400,
            statusMessage: query.error_description,
        })
    }
    const { code, state } = query
    if (!code || !state) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing code or state',
        })
    }
    const authSession = await getAuthSessionData(event)
    if (!isAuthStateSessionData(authSession)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid state',
        })
    }
    const { nonce, returnUrl } = authSession
    if (nonce !== state) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid state',
        })
    }

    const userAgent = getHeader(event, 'user-agent')

    const { user, accessToken, refreshToken } = await workos.userManagement.authenticateWithCode({
        clientId: env.WORKOS_CLIENT_ID,
        code,
        ipAddress: getRequestIP(event),
        userAgent,
    })
    let dbUser = await userCRUD.query.getUser(user.id)
    if (!dbUser) {
        await userCRUD.mutate.createUser(user.id, user.email, user.firstName ?? '', user.lastName ?? '')
        dbUser = await userCRUD.query.getUserRequired(user.id)
    }
    await setAuthSessionData(event, {
        status: 'authenticated',
        userId: dbUser.userId,
        data: dbUser,
        secure: { accessToken, refreshToken },
    })
    return sendRedirect(event, returnUrl)
})
