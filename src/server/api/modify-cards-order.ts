import express from 'express'

import { query } from '@/server/modules/query'
import { escape } from '../modules/escape'
import { connection } from '@/server/modules/connection'

import { MysqlInsertOrUpdateResult } from '@/types/query'

const router = express.Router()

export type ModifyCardOrderRequestBody = {
  cardId: number
  columnId: number
  previousCardId: number
}

router.put('/board/order', async (req, res) => {
  const {
    cardId,
    columnId,
    previousCardId,
  } = req.body as ModifyCardOrderRequestBody

  try {
    const [targetCard] = await query(
      `SELECT * FROM card WHERE id=${escape(cardId)}`
    )

    await query(
      `UPDATE card SET previousCardId=${escape(
        targetCard.previousCardId
      )} WHERE previousCardId=${escape(targetCard.id)}`
    )

    if (previousCardId) {
      await query(
        `UPDATE card SET previousCardId=${escape(
          targetCard.id
        )} WHERE previousCardId=${escape(previousCardId)}`
      )
    } else {
      await query(
        `UPDATE card SET previousCardId=${escape(
          previousCardId
        )}, columnId=${escape(
          columnId
        )} WHERE ISNULL(previousCardId) AND columnId=${escape(columnId)}`
      )
    }

    await query(
      `UPDATE card SET previousCardId=${escape(
        previousCardId
      )}, columnId=${escape(columnId)} WHERE id=${escape(targetCard.id)}`
    )
  } catch (err) {
    console.log(err)
    throw err
  }

  res.sendStatus(200)
})

export { router as modifyACardsOrderRouter }
