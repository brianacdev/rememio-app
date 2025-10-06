import env from '../env'
import * as schema from './schema'

import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Drizzle example with the Neon serverless driver
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'

function getNeonDrizzle() {
    const client = neon(env.DATABASE_URL)
    return drizzleNeon({ client, casing: 'snake_case', schema })
}

function getPostgresDrizzle() {
    const client = postgres(env.DATABASE_URL)
    return drizzlePostgres({ client, casing: 'snake_case', schema })
}

export const db = env.DATABASE_DRIVER === 'neon' ? getNeonDrizzle() : getPostgresDrizzle()
export const tables = schema

export async function closeDb() {
    if (env.DATABASE_DRIVER === 'postgres') {
        await (db as ReturnType<typeof getPostgresDrizzle>).$client.end()
    }
}

export default db
