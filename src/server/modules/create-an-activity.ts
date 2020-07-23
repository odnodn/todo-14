import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'
import { ActivityType } from '@/types/response'
import { MysqlInsertOrUpdateResult } from '@/types/query'
export const createActivity = async (param: {
  type: ActivityType
  boardId: number
  content: string
}) => {
  const { type, boardId, content } = param
  const { insertId } = await query<MysqlInsertOrUpdateResult>(`
    INSERT INTO activity (\`type\`, boardId, content)
    VALUES (${escape(type)}, ${escape(boardId)}, ${escape(content)})`)
  return insertId
}
