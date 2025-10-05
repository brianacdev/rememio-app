import { z } from 'zod/v4'
import { memorialCRUD } from '~~/server/crud'

const addCommentSchema = z.object({
    content: z.string().trim().min(1).max(4000),
})

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const postId = getRouterParam(event, 'postId')
    if (!postId) {
        throw createError({ statusCode: 400, message: 'Post ID is required' })
    }

    const postIdNumber = parseInt(postId, 10)
    if (isNaN(postIdNumber)) {
        throw createError({ statusCode: 400, message: 'Post ID must be a number' })
    }

    const body = await readValidatedBody(event, addCommentSchema.parse)
    await memorialCRUD.mutate.addPostComment(memorialId, postIdNumber, userId, body.content)

    setResponseStatus(event, 201)
})
