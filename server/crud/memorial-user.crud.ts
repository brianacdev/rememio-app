import { db, tables } from '~~/server/db'
import { oneOrNullAsync } from '~~/shared/utils/array.util'
import type { MemorialUserRole } from '~~/shared/types/db.type'
import { funcs } from '~~/server/utils/drizzle.util'

export const memorialUserCRUD = {
    query: {
        getMemorialUsers: async (memorialId: string) => {
            return await db
                .select({
                    memorialUser: tables.memorialUsers,
                    user: tables.users,
                })
                .from(tables.memorialUsers)
                .innerJoin(
                    tables.users,
                    funcs.and(
                        funcs.eq(tables.memorialUsers.userId, tables.users.userId),
                        funcs.eq(tables.users.isBanned, false)
                    )
                )
                .where(funcs.eq(tables.memorialUsers.memorialId, memorialId))
        },

        getMemorialUser: async (memorialId: string, userId: string) => {
            return await oneOrNullAsync(
                db
                    .select({
                        memorialUser: tables.memorialUsers,
                        user: tables.users,
                    })
                    .from(tables.memorialUsers)
                    .innerJoin(
                        tables.users,
                        funcs.and(
                            funcs.eq(tables.memorialUsers.userId, tables.users.userId),
                            funcs.eq(tables.users.isBanned, false)
                        )
                    )
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorialUsers.memorialId, memorialId),
                            funcs.eq(tables.memorialUsers.userId, userId)
                        )
                    )
            )
        },

        getMemorialUserContext: async (memorialId: string, userId: string) => {
            return await oneOrNullAsync(
                db
                    .select({
                        memorialUser: tables.memorialUsers,
                        user: tables.users,
                        memorialOwner: tables.memorials.owner,
                    })
                    .from(tables.memorialUsers)
                    .innerJoin(
                        tables.users,
                        funcs.and(
                            funcs.eq(tables.memorialUsers.userId, tables.users.userId),
                            funcs.eq(tables.users.isBanned, false)
                        )
                    )
                    .innerJoin(tables.memorials, funcs.eq(tables.memorialUsers.memorialId, tables.memorials.memorialId))
                    .where(
                        funcs.and(
                            funcs.eq(tables.memorialUsers.memorialId, memorialId),
                            funcs.eq(tables.memorialUsers.userId, userId),
                            funcs.eq(tables.memorials.isDeleted, false)
                        )
                    )
            )
        },
    },
    mutate: {
        createOrUpdateMemorialUser: async (
            memorialId: string,
            userId: string,
            role: MemorialUserRole = 'user',
            relation = ''
        ) => {
            await db
                .insert(tables.memorialUsers)
                .values({
                    memorialId,
                    userId,
                    role,
                    relation,
                })
                .onConflictDoUpdate({
                    target: [tables.memorialUsers.memorialId, tables.memorialUsers.userId],
                    set: {
                        role,
                        relation,
                    },
                })
        },

        banMemorialUser: async (memorialId: string, userId: string, banUserId: string) => {
            await db
                .update(tables.memorialUsers)
                .set({
                    bannedAt: new Date().toISOString(),
                    bannedBy: banUserId,
                })
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialUsers.memorialId, memorialId),
                        funcs.eq(tables.memorialUsers.userId, userId)
                    )
                )
        },

        unbanMemorialUser: async (memorialId: string, userId: string) => {
            await db
                .update(tables.memorialUsers)
                .set({
                    bannedAt: null,
                    bannedBy: null,
                })
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialUsers.memorialId, memorialId),
                        funcs.eq(tables.memorialUsers.userId, userId)
                    )
                )
        },

        updateMemorialUserRole: async (memorialId: string, userId: string, role: MemorialUserRole = 'user') => {
            await db
                .update(tables.memorialUsers)
                .set({
                    role,
                })
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialUsers.memorialId, memorialId),
                        funcs.eq(tables.memorialUsers.userId, userId)
                    )
                )
        },

        updateMemorialUserRelation: async (memorialId: string, userId: string, relation: string) => {
            await db
                .update(tables.memorialUsers)
                .set({
                    relation,
                })
                .where(
                    funcs.and(
                        funcs.eq(tables.memorialUsers.memorialId, memorialId),
                        funcs.eq(tables.memorialUsers.userId, userId)
                    )
                )
        },
    },
}

export type GetMemorialUsersResults = Awaited<ReturnType<typeof memorialUserCRUD.query.getMemorialUsers>>
export type GetMemorialUserContextResults = Awaited<ReturnType<typeof memorialUserCRUD.query.getMemorialUserContext>>
