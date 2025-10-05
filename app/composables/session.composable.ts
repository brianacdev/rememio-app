import { useState, computed, useRequestFetch } from '#imports'
import type { AuthSession } from '~~/shared/types/session.type'
import { isAuthSessionAuthenticated, anonymousAuthSessionData } from '~~/shared/utils/session.util'

export function useAuthSession() {
    const requestFetch = useRequestFetch()
    const sessionState = useState<AuthSession>('rem-auth-session', () => anonymousAuthSessionData)
    const authReadyState = useState<boolean>('rem-auth-ready', () => false)

    const fetch = async () => {
        sessionState.value = await requestFetch('/api/auth/session', {
            headers: {
                accept: 'application/json',
            },
            retry: false,
        }).catch(() => anonymousAuthSessionData)
        authReadyState.value = true
    }
    const clear = async () => {
        sessionState.value = anonymousAuthSessionData
        authReadyState.value = true
    }

    return {
        ready: computed(() => authReadyState.value),
        loggedIn: computed(() => isAuthSessionAuthenticated(sessionState.value)),
        session: sessionState,
        user: computed(() => (isAuthSessionAuthenticated(sessionState.value) ? sessionState.value.data : null)),
        fetch,
        clear,
    }
}
