import { z } from 'zod/v4'
import { memorialUserCRUD, accessCRUD } from '~~/server/crud'

const BanUserSchema = z.object({
    userId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireEditMemorial(event)

    try {
        const body = await readValidatedBody(event, BanUserSchema.parse)
        const memorialUserAccess = await accessCRUD.query.getMemorialUserAccessInfo(memorialId, body.userId)

        if (!memorialUserAccess) {
            throw createError({ statusCode: 404, statusMessage: 'Memorial user access not found' })
        }

        if (memorialUserAccess.isOwnerUser) {
            throw createError({ statusCode: 400, statusMessage: 'Cannot ban owner user' })
        }

        if (memorialUserAccess.role === 'admin') {
            throw createError({ statusCode: 400, statusMessage: 'Cannot ban admin user' })
        }
        const isBanned = memorialUserAccess.isMemorialUserBanned

        if (isBanned) {
            await memorialUserCRUD.mutate.unbanMemorialUser(memorialId, body.userId)
        } else {
            await memorialUserCRUD.mutate.banMemorialUser(memorialId, body.userId, userId)
        }

        setResponseStatus(event, 204)
        return 'No content'
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({ statusCode: 500, statusMessage: 'Failed to update role' })
    }
})
