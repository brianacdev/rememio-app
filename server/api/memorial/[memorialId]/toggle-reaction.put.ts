import { z } from 'zod/v4'
import { memorialCRUD } from '~~/server/crud'

const toggleReactionSchema = z.union([
    z.object({
        photoId: z.string(),
    }),
    z.object({
        postId: z.number(),
    }),
])

export default defineEventHandler(async (event) => {
    const { memorialId, userId } = await requireViewMemorial(event)
    const body = await readValidatedBody(event, toggleReactionSchema.parse)

    if ('photoId' in body) {
        const hasReacted = await memorialCRUD.mutate.togglePhotoReaction(memorialId, body.photoId, userId)
        return {
            hasReacted,
        }
    } else if ('postId' in body) {
        const hasReacted = await memorialCRUD.mutate.togglePostReaction(memorialId, body.postId, userId)
        return {
            hasReacted,
        }
    }
    setResponseStatus(event, 204)
})
