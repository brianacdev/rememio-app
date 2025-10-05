import { z } from 'zod/v4'
import { memorialUserCRUD } from '~~/server/crud'

const UpdateRelationSchema = z.object({
    relation: z.string().min(1),
})

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)

    const body = await readValidatedBody(event, UpdateRelationSchema.parse)
    const { relation } = body

    if (!relation.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Relation is required and must be a non-empty string',
        })
    }

    // Update the user's relation to the memorial
    await memorialUserCRUD.mutate.updateMemorialUserRelation(memorialId, userId, relation)

    setResponseStatus(event, 204)

    return 'No content'
})
