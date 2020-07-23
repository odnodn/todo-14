import { query } from '@/server/modules/query'
import { Card } from '@/types/schema'
import express from 'express'
import { escape } from '../modules/escape'
import { getCardTitle } from '@/client/utils/content-parser'
import { createActivity } from '../modules/create-an-activity'

const router = express.Router()

export type ModifyCardOrderRequestParams = {
  boardId: number
}

export type ModifyCardOrderRequestBody = {
  cardId: number
  columnId: number
  previousCardId: number
}

router.put('/board/:boardId/order', async (req, res) => {
  const {
    cardId,
    columnId,
    previousCardId,
  } = req.body as ModifyCardOrderRequestBody
  const { boardId } = (req.params as unknown) as ModifyCardOrderRequestParams

  try {
    const [targetCard] = await query<Card[]>(
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
          targetCard.id
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

    const cardTitle = getCardTitle(targetCard.content)
    createActivity({
      type: 'move',
      boardId,
      content: `<<${cardTitle}>>가 이동되었습니다.`,
    })
  } catch (err) {
    console.log(err)
    throw err
  }

  res.sendStatus(200)
})

export { router as modifyACardsOrderRouter }
