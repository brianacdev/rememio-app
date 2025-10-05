import { z } from 'zod/v4'
import { memorialCRUD } from '~~/server/crud'

const addCommentSchema = z.object({
    content: z.string().trim().min(1).max(4000),
})

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const photoId = getRouterParam(event, 'photoId')
    if (!photoId) {
        throw createError({ statusCode: 400, message: 'Photo ID is required' })
    }

    const body = await readValidatedBody(event, addCommentSchema.parse)
    await memorialCRUD.mutate.addPhotoComment(memorialId, photoId, userId, body.content)

    setResponseStatus(event, 201)
})
