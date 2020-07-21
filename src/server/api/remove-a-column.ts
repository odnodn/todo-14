import { Card, Column } from '@/types/schema'

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

  // Transfer the preivous column ID to the next column if exists
  if (nextColumn) {
    await query(`
      UPDATE \`column\`
      SET
      previousColumnId=${previousColumnId}
      WHERE
      id=${escape(nextColumn.id)}
    `)
  }

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

  // TODO: Check user ownership
  const removeColumnQuery = `
    UPDATE \`column\`
    SET
    isDeleted=1
    WHERE
    id=${escape(columnId)}
  `

  await query(removeColumnQuery)

  res.sendStatus(200)
})

export { router as removeAColumnRouter }
