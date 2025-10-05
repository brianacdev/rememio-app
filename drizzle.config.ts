import { defineConfig } from 'drizzle-kit'
import env from './server/env'

export default defineConfig({
    dialect: 'postgresql',
    schema: './server/db/schema.ts',
    out: './drizzle',
    casing: 'snake_case',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
})
