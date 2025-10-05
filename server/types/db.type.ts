import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { tables } from '../db'

export type PhotoInsert = InferInsertModel<typeof tables.photos>
export type CommentDB = InferSelectModel<typeof tables.comments>
