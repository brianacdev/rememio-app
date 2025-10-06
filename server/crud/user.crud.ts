import { z } from 'zod/v4'
import { trim } from 'es-toolkit/compat'

import { db, tables } from '~~/server/db'
import { funcs } from '~~/server/utils/drizzle.util'
import { oneOrNullAsync, oneAsync, scalarsAsync } from '~~/shared/utils/array.util'

export const updateUserNamesSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
})

async function _getUser(userId: string) {
    return await oneOrNullAsync(db.select().from(tables.users).where(funcs.eq(tables.users.userId, userId)))
}

export const userCRUD = {
    query: {
        getAllUsers: async () => {
            return await db.select().from(tables.users)
        },
        userCount: async () => {
            return scalarsAsync(db.select({ count: funcs.count() }).from(tables.users))
        },
        getUserPhoto: async (userId: string) => {
            const results = await oneOrNullAsync(
                db
                    .select({
                        photo: tables.photos,
                    })
                    .from(tables.photos)
                    .innerJoin(tables.users, funcs.eq(tables.users.photoId, tables.photos.photoId))
                    .where(funcs.eq(tables.users.userId, userId))
            )
            return results?.photo
        },
        getUser: _getUser,
        getUserRequired: async (userId: string) => {
            const user = await _getUser(userId)
            if (!user) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found',
                })
            }
            return user
        },
        isBanned: async (userId: string) => {
            const banData = await oneAsync(
                db
                    .select({
                        isBanned: tables.users.isBanned,
                    })
                    .from(tables.users)
                    .where(funcs.eq(tables.users.userId, userId))
            )
            return banData.isBanned
        },
        getUserMemorials: async (userId: string) => {
            return await db
                .select({
                    memorial: tables.memorials,
                    memorialUser: tables.memorialUsers,
                })
                .from(tables.memorials)
                .innerJoin(
                    tables.memorialUsers,
                    funcs.and(
                        funcs.eq(tables.memorials.memorialId, tables.memorialUsers.memorialId),
                        funcs.eq(tables.memorialUsers.isBanned, false),
                        funcs.eq(tables.memorialUsers.userId, userId),
                        funcs.eq(tables.memorials.isDeleted, false)
                    )
                )
        },
        getMemorialIds: async (userId: string) => {
            return await scalarsAsync(
                db
                    .select({
                        memorialId: tables.memorials.memorialId,
                    })
                    .from(tables.memorials)
                    .innerJoin(
                        tables.memorialUsers,
                        funcs.and(
                            funcs.eq(tables.memorials.memorialId, tables.memorialUsers.memorialId),
                            funcs.eq(tables.memorialUsers.isBanned, false)
                        )
                    )
                    .where(funcs.eq(tables.memorialUsers.userId, userId))
            )
        },
    },
    mutate: {
        createUser: async (userId: string, email: string, firstName: string, lastName: string) => {
            return await db.insert(tables.users).values({ userId, email, firstName, lastName })
        },
        updateUserNames: async (userId: string, firstName: string, lastName: string) => {
            return await db
                .update(tables.users)
                .set({
                    firstName: trim(firstName),
                    lastName: trim(lastName),
                })
                .where(funcs.eq(tables.users.userId, userId))
        },
        updateUserPhoto: async (userId: string, photoId: string) => {
            return await db.update(tables.users).set({ photoId }).where(funcs.eq(tables.users.userId, userId))
        },
    },
}

export type UpdateUserNamesData = z.infer<typeof updateUserNamesSchema>
export type GetUserMemorialsResult = Awaited<ReturnType<typeof userCRUD.query.getUserMemorials>>
