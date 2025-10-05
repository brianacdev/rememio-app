import { db, tables } from '~~/server/db'
import { oneOrNullAsync } from '#shared/utils/array.util'
import { funcs } from '~~/server/utils/drizzle.util'

const _getMemorialUserAccessInfo = async (memorialId: string, userId: string) => {
    return await oneOrNullAsync(
        db
            .select({
                role: tables.memorialUsers.role,
                isMemorialUserBanned: tables.memorialUsers.isBanned,
                isUserBanned: tables.users.isBanned,
                isMemorialDeleted: tables.memorials.isDeleted,
                userRole: tables.users.role,
                isOwnerUser: funcs.eq(tables.memorials.owner, tables.users.userId),
            })
            .from(tables.memorialUsers)
            .innerJoin(tables.memorials, funcs.eq(tables.memorialUsers.memorialId, tables.memorials.memorialId))
            .innerJoin(tables.users, funcs.eq(tables.memorialUsers.userId, tables.users.userId))
            .where(
                funcs.and(
                    funcs.eq(tables.memorialUsers.memorialId, memorialId),
                    funcs.eq(tables.memorialUsers.userId, userId)
                )
            )
    )
}

const _canViewMemorial = async (memorialId: string, userId: string) => {
    const memorialUserAccess = await _getMemorialUserAccessInfo(memorialId, userId)
    if (!memorialUserAccess || memorialUserAccess.isMemorialUserBanned || memorialUserAccess.isUserBanned) {
        return false
    }
    return true
}

const _isMemorialObituaryPublic = async (memorialId: string) => {
    const memorialCount = await db.$count(
        tables.memorials,
        funcs.and(
            funcs.eq(tables.memorials.memorialId, memorialId),
            funcs.eq(tables.memorials.isObituaryPublic, true),
            funcs.eq(tables.memorials.isDeleted, false)
        )
    )

    return memorialCount > 0
}

export const accessCRUD = {
    query: {
        getMemorialUserAccessInfo: _getMemorialUserAccessInfo,

        canAccessPhoto: async (photoId: string, userId: string) => {
            const photoCount = await db.$count(
                tables.photos,
                funcs.and(
                    funcs.eq(tables.photos.photoId, photoId),
                    funcs.eq(tables.photos.isDeleted, false),
                    funcs.eq(tables.photos.createdBy, userId)
                )
            )

            return photoCount > 0
        },

        canAccessMemorialPhoto: async (photoId: string, memorialId: string, userId: string) => {
            if (await _canViewMemorial(memorialId, userId)) {
                const photoCount = await db.$count(
                    tables.memorialPhotos,
                    funcs.and(
                        funcs.eq(tables.memorialPhotos.photoId, photoId),
                        funcs.eq(tables.memorialPhotos.memorialId, memorialId),
                        funcs.eq(tables.memorialPhotos.isDeleted, false)
                    )
                )

                return photoCount > 0
            }

            return false
        },

        canViewMemorial: _canViewMemorial,

        canViewMemorialObituary: async (memorialId: string, userId: string) => {
            if (await _isMemorialObituaryPublic(memorialId)) return true
            return await _canViewMemorial(memorialId, userId)
        },

        canAddPost: async (memorialId: string, userId: string) => {
            const memorialUserAccess = await _getMemorialUserAccessInfo(memorialId, userId)
            if (!memorialUserAccess || memorialUserAccess.isMemorialUserBanned || memorialUserAccess.isUserBanned) {
                return false
            }
            return true
        },

        canEditMemorial: async (memorialId: string, userId: string) => {
            const memorialUserAccess = await _getMemorialUserAccessInfo(memorialId, userId)
            if (!memorialUserAccess || memorialUserAccess.isMemorialUserBanned || memorialUserAccess.isUserBanned) {
                return false
            }

            return ['admin', 'owner'].includes(memorialUserAccess.role)
        },
    },
    mutate: {},
}
