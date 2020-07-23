import { Board, Column } from '@/types/schema'

import { MysqlInsertOrUpdateResult } from '@/types/query'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'
import { mapSort } from './get-a-board-data'
import { createActivity } from '../modules/create-an-activity'

const router = express.Router()

export type CreateColumnRequestParams = {
  boardId: number
}

export type CreateColumnRequestBody = {
  name: string
}

router.post('/board/:boardId', async (req, res) => {
  const boardId = parseInt(req.params.boardId)
  const name = req.body.name

  // If one or many of the requested data are missing,
  // consider the request as a bad request
  if (!boardId || !(name && name.length > 0 && name.trim().length > 0)) {
    res.sendStatus(400)

    return
  }

  // Find the board corresponding to the requested `boardId`
  const board = (await query(
    `SELECT * FROM board WHERE id=${escape(boardId)}`
  )) as Board[]

  // If the board doesn't exist,
  // bad request
  if (board.length === 0) {
    res.sendStatus(400)

    return
  }

  // TODO: Check if the board is owned by the user in the session

  const columns = await query<Column[]>(`
    SELECT * FROM \`column\`
    WHERE
    boardId = ${escape(boardId)}
    AND
    isDeleted = 0
  `)

  const sortedColumns = mapSort(columns, 'previousColumnId')

  const lastColumn = sortedColumns[sortedColumns.length - 1]

  // Insert the column to the table
  const { insertId } = await query<MysqlInsertOrUpdateResult>(`
    INSERT INTO \`column\`
    (boardId, name, previousColumnId)
    VALUES
    (${escape(boardId)}, ${escape(name)}, ${escape(lastColumn?.id)})
  `)

  const [column] = await query<Column[]>(
    `SELECT * FROM \`column\` WHERE id=${insertId}`
  )

  if (!column) {
    res.sendStatus(500)
    return
  }

  // Create an activity after the creation
  await createActivity({
    type: 'add',
    boardId,
    content: '컬럼이 추가되었습니다.',
  })

  res.json({ column })
})

export { router as createAColumnRouter }
