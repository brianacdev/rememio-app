import type { UserRole } from './db.type'

export type AuthSessionAnonymous = {
    status: 'anonymous'
}

export type AuthSessionAuthenticated = {
    status: 'authenticated'
    userId: string
    data: {
        userId: string
        firstName: string
        lastName: string
        fullName: string
        photoId: string | null
        role: UserRole
    }
}

export type AuthSession = AuthSessionAnonymous | AuthSessionAuthenticated
