import type { AuthSessionAnonymous, AuthSessionAuthenticated, AuthStateSessionData } from '~~/shared/types/session.type'

export type MaybeAuthSession =
    | {
          status: 'authenticated' | 'anonymous' | 'auth-state'
      }
    | null
    | undefined

export const isAuthSessionAuthenticated = (session: MaybeAuthSession): session is AuthSessionAuthenticated =>
    session?.status === 'authenticated'
export const isAuthSessionAnonymous = (session: MaybeAuthSession): session is AuthSessionAnonymous =>
    session?.status !== 'authenticated'
export const isAuthStateSessionData = (session: MaybeAuthSession): session is AuthStateSessionData =>
    session?.status === 'auth-state'

export const anonymousAuthSessionData = { status: 'anonymous' as const } satisfies AuthSessionAnonymous
