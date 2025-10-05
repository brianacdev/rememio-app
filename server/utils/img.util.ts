import { z } from 'zod/v4'

export function getImageOrientation(image: { width: number | null; height: number | null }) {
    if (!image.width || !image.height) {
        return ''
    }
    if (image.width > image.height) {
        return 'landscape'
    }
    if (image.width < image.height) {
        return 'portrait'
    }
    return 'square'
}

export type ImageOrientation = ReturnType<typeof getImageOrientation>

export const PhotoMetadataSchema = z.object({
    postId: z.number().nullish(),
    memorialId: z.string().nullish(),
    userId: z.string().nullish(),
    photoId: z.string().nullish(),
    filename: z.string().nullish(),
    size: z.number().nullish(),
    contentType: z.string().nullish(),
    orientation: z.string().nullish(),
    width: z.number().nullish(),
    height: z.number().nullish(),
})

export type PhotoMetadata = z.infer<typeof PhotoMetadataSchema>
