import { z } from 'zod/v4'
import { memorialCRUD } from '~~/server/crud'

const addCommentSchema = z.union([
    z.object({
        content: z.string(),
        photoId: z.string(),
    }),
    z.object({
        content: z.string(),
        postId: z.number(),
    }),
])

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const body = await readValidatedBody(event, addCommentSchema.parse)

    if ('photoId' in body && body.photoId) {
        await memorialCRUD.mutate.addPhotoComment(memorialId, body.photoId, userId, body.content)
    } else if ('postId' in body && body.postId) {
        await memorialCRUD.mutate.addPostComment(memorialId, body.postId, userId, body.content)
    }

    setResponseStatus(event, 204)
})
