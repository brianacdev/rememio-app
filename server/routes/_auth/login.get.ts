import { workos } from '~~/server/utils/auth.util'
import { nanoid } from 'nanoid'
import env from '~~/server/env'
import { setAuthSessionData } from '~~/server/utils/session.util'

export default defineEventHandler(async (event) => {
    const query = getQuery<{ returnUrl?: string }>(event)
    const state = nanoid()
    const authUrl = workos.userManagement.getAuthorizationUrl({
        clientId: env.WORKOS_CLIENT_ID,
        redirectUri: env.WORKOS_REDIRECT_URI,
        state,
        provider: 'authkit',
    })
    await setAuthSessionData(event, {
        status: 'auth-state' as const,
        nonce: state,
        returnUrl: query.returnUrl || '/',
    })
    return sendRedirect(event, authUrl)
})
