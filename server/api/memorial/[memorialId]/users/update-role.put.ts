import { z } from 'zod/v4'
import { db, tables } from '~~/server/db'
import { funcs } from '~~/server/utils/drizzle.util'
import { memorialUserCRUD, memorialCRUD } from '~~/server/crud'

const UpdateRoleSchema = z.object({
    userId: z.string().min(1),
    role: z.enum(['admin', 'user']),
})

export default defineEventHandler(async (event) => {
    const { memorialId } = await requireEditMemorial(event)

    try {
        const body = await readValidatedBody(event, UpdateRoleSchema.parse)

        const ownerUserId = await memorialCRUD.query.getOwnerUserId(memorialId)

        if (!ownerUserId) {
            throw createError({ statusCode: 404, statusMessage: 'Memorial not found' })
        }

        if (body.userId === ownerUserId) {
            throw createError({ statusCode: 400, statusMessage: 'Cannot update owner role' })
        }

        await memorialUserCRUD.mutate.updateMemorialUserRole(memorialId, body.userId, body.role)

        setResponseStatus(event, 204)
        return 'No content'
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({ statusCode: 500, statusMessage: 'Failed to update role' })
    }
})
