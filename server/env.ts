import { z } from 'zod/v4'

const envSchema = z.object({
    SESSION_PASSWORD: z.string(),
    BUCKET_NAME: z.string(),
    PHOTO_STORAGE_LOCATION: z.string(),
    DATABASE_DRIVER: z.enum(['postgres', 'neon']),
    DATABASE_URL: z.string(),
    WORKOS_CLIENT_ID: z.string(),
    WORKOS_API_KEY: z.string(),
    WORKOS_REDIRECT_URI: z.string(),
})

const env = envSchema.parse(process.env)

export default env
