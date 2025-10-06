import type { H3Event } from 'h3'

import env from '~~/server/env'
import type { AuthSessionAnonymous, AuthSessionAuthenticated, AuthStateSessionData } from '~~/shared/types/session.type'
import { isAuthSessionAuthenticated, anonymousAuthSessionData } from '~~/shared/utils/session.util'

export type AuthSessionAuthenticatedSecure = AuthSessionAuthenticated & {
    secure: {
        accessToken: string
        refreshToken: string
    }
}

export type AuthSessionSecure = AuthSessionAnonymous | AuthSessionAuthenticatedSecure | AuthStateSessionData

export const getAuthSessionData = async (event: H3Event) => {
    const authSession = await _useAuthSession(event)
    const data = authSession.data
    if (!data) {
        await authSession.update(anonymousAuthSessionData)
        return anonymousAuthSessionData
    }
    return data
}

export const requireAuthSession = async (event: H3Event) => {
    const authSessionData = await getAuthSessionData(event)
    if (!isAuthSessionAuthenticated(authSessionData)) {
        await clearAuthSession(event)
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return authSessionData
}

export const setAuthSessionData = async (event: H3Event, data: AuthSessionSecure = anonymousAuthSessionData) => {
    const session = await _useAuthSession(event)
    await session.clear()
    await session.update(data)
}

export const clearAuthSession = async (event: H3Event) => {
    await setAuthSessionData(event, anonymousAuthSessionData)
}

const _useAuthSession = async (event: H3Event) => {
    const session = await useSession<AuthSessionSecure>(event, {
        name: 'rma-session',
        password: env.SESSION_PASSWORD,
        maxAge: 60 * 60 * 24 * 90, // 90 days
        cookie: {
            httpOnly: true,
            secure: !import.meta.dev,
            sameSite: 'lax',
            path: '/',
        },
    })
    if (!session.data) await session.update(anonymousAuthSessionData)
    return session
}
