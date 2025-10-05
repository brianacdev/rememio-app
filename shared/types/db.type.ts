import { z } from 'zod/v4'
import {
    userDBSchema,
    partnerDBSchema,
    memorialDBSchema,
    invitationDBSchema,
    memorialUserDBSchema,
    partnerUserDBSchema,
    postDBSchema,
    photoDBSchema,
    commentDBSchema,
    reactionDBSchema,
} from '~~/server/schemas/db.schema'

export type UserDB = z.infer<typeof userDBSchema>
export type UserRole = UserDB['role']
export type PartnerDB = z.infer<typeof partnerDBSchema>
export type MemorialDB = z.infer<typeof memorialDBSchema>
export type InvitationDB = z.infer<typeof invitationDBSchema>
export type MemorialUserDB = z.infer<typeof memorialUserDBSchema>
export type MemorialUserRole = MemorialUserDB['role']
export type PartnerUserDB = z.infer<typeof partnerUserDBSchema>
export type PartnerUserRole = PartnerUserDB['role']
export type PostDB = z.infer<typeof postDBSchema>
export type PhotoDB = z.infer<typeof photoDBSchema>
export type CommentDB = z.infer<typeof commentDBSchema>
export type ReactionDB = z.infer<typeof reactionDBSchema>
