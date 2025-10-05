import type { AuthSessionAnonymous, AuthSessionAuthenticated } from '~~/shared/types/session.type'

export type MaybeAuthSession =
    | {
          status: 'authenticated' | 'anonymous'
      }
    | null
    | undefined

export const isAuthSessionAuthenticated = (session: MaybeAuthSession): session is AuthSessionAuthenticated =>
    session?.status === 'authenticated'
export const isAuthSessionAnonymous = (session: MaybeAuthSession): session is AuthSessionAnonymous =>
    session?.status !== 'authenticated'

export const anonymousAuthSessionData = { status: 'anonymous' as const } satisfies AuthSessionAnonymous
