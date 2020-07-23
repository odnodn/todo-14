import { Column, Card } from '@/types/schema'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'
import { connection } from '../modules/connection'
import { createActivity } from '../modules/create-an-activity'

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
    res.sendStatus(400)
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
      previousColumnId=${escape(column.previousColumnId)}
      WHERE
      previousColumnId=${escape(columnId)}
      `)

    const cards = await query<Card[]>(`
    SELECT *
    FROM card
    WHERE columnId = ${escape(columnId)}
  `)

    if (cards.length > 0) {
      let removeCardsQuery = ''

      cards.forEach((card) => {
        removeCardsQuery += `
      UPDATE card
      SET isDeleted = 1
      WHERE id = ${escape(card.id)};
    `
      })

      await query(removeCardsQuery)
    }

    // Create an activity after a removal
    await createActivity({
      type: 'delete',
      boardId,
      content: `[[${column.name}]] 컬럼이 삭제되었습니다.`,
      // columnId,
    })

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
