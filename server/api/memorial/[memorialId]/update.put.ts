import { z } from 'zod/v4'
import { memorialCRUD } from '~~/server/crud'
import { getNameUrlEncoded } from '~~/server/utils/user.util'

const updateMemorialSchema = z.object({
    name: z.string().min(1),
    birthDateStr: z.string().optional(),
    deathDateStr: z.string().optional(),
    obituary: z.string().optional(),
    isObituaryPublic: z.boolean().default(false),
})

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireEditMemorial(event)

    try {
        const body = await readValidatedBody(event, updateMemorialSchema.parse)

        await memorialCRUD.mutate.updateMemorial(memorialId, {
            ...body,
            nameSlug: getNameUrlEncoded(body.name),
        })

        setResponseStatus(event, 204)

        return 'No content'
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch memorial',
        })
    }
})
