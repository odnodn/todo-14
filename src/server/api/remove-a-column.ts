import { Column } from '@/types/schema'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'

const router = express.Router()

// TODO: Create a middleware for validating
// board, column, card existence
// board <- column inclusion and
// user ownership
router.delete('/board/:boardId/column/:columnId', async ({ params }, res) => {
  const boardId = parseInt(params.boardId)
  const columnId = parseInt(params.columnId)

  if (!boardId || !columnId) {
    res.sendStatus(400)
    return
  }

  const [column] = await query<Column[]>(
    `SELECT * FROM \`column\` WHERE id=${escape(columnId)}`
  )

  const previousColumnId = column.previousColumnId

  const [nextColumn] = await query<Column[]>(
    `SELECT * FROM \`column\` WHERE previousColumnId=${escape(columnId)}`
  )

  // TODO: transaction

  if (nextColumn) {
    await query(`
      UPDATE \`column\`
      SET
      previousColumnId=${previousColumnId}
      WHERE
      id=${escape(nextColumn.id)}
    `)
  }

  // TODO: Check user ownership
  const sql = `
    DELETE FROM \`column\`
    WHERE
    id=${escape(columnId)}
  `

  await query(sql)

  res.sendStatus(200)
})

export { router as removeAColumnRouter }
