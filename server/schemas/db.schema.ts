import { tables } from '../db'
import { createSelectSchema } from 'drizzle-zod'

export const userDBSchema = createSelectSchema(tables.users)
export const partnerDBSchema = createSelectSchema(tables.partners)
export const partnerUserDBSchema = createSelectSchema(tables.partnerUsers)
export const invitationDBSchema = createSelectSchema(tables.memorialInvitations)
export const photoDBSchema = createSelectSchema(tables.photos)
export const reactionDBSchema = createSelectSchema(tables.reactions)

export const memorialDBSchema = createSelectSchema(tables.memorials)
export const memorialPhotoDBSchema = createSelectSchema(tables.memorialPhotos)
export const memorialUserDBSchema = createSelectSchema(tables.memorialUsers)

export const postDBSchema = createSelectSchema(tables.posts)
export const commentDBSchema = createSelectSchema(tables.comments)
