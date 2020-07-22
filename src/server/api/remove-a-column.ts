import { Column } from '@/types/schema'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'
import { connection } from '../modules/connection'

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

  if (!column) {
    res.sendStatus(404)
    return
  }

  connection.beginTransaction(async (err) => {
    if (err) throw err

    await query(`
      UPDATE \`column\` SET isDeleted=1, previousColumnId=null
      WHERE id=${escape(columnId)}
      `)

    await query(`
      UPDATE \`column\`
      SET
      previousColumnId=${column.previousColumnId}
      WHERE
      previousColumnId=${escape(columnId)}
      `)

    connection.commit((err) => {
      if (err) {
        res.sendStatus(500)
        return connection.rollback(() => {})
      }
    })
  })

  res.sendStatus(200)
})

export { router as removeAColumnRouter }
