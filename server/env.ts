import { z } from 'zod/v4'

const envSchema = z.object({
    DATABASE_URL: z.string(),
    SESSION_PASSWORD: z.string(),
    BUCKET_NAME: z.string(),
    PHOTO_STORAGE_LOCATION: z.string(),
})

const env = envSchema.parse(process.env)

export default env
