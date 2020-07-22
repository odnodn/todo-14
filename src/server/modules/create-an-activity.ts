import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'

import { ActivityType } from '@/types/response'
import { MysqlInsertOrUpdateResult } from '@/types/query'

export const createActivity = async (param: {
  type: ActivityType
  boardId: number
  cardId?: number
  columnId?: number
  to?: string
  from?: string
}) => {
  const { type, boardId, cardId, columnId, to, from } = param

  const { insertId } = await query<MysqlInsertOrUpdateResult>(`
    INSERT INTO activity (\`type\`, boardId, cardId, columnId, \`to\`, \`from\`)
    VALUES (${escape(type)}, ${escape(boardId)}, ${escape(cardId)}, ${escape(
    columnId
  )}, ${escape(to)}, ${escape(from)})`)

  return insertId
}
