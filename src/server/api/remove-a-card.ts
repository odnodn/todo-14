import express from 'express'

import { query } from '@/server/modules/query'
import { connection } from '@/server/modules/connection'
import { escape } from '../modules/escape'

import { MysqlInsertOrUpdateResult } from '@/types/query'
import { Card, Column } from '@/types/schema'
import { createActivity } from '../modules/create-an-activity'
import { getCardTitle } from '@/client/utils/content-parser'

const router = express.Router()

export type RemoveCardRequestParams = {
  boardId: number
  columnId: number
  cardId: number
}

router.delete(
  '/board/:boardId/column/:columnId/card/:cardId',
  async (req, res) => {
    const {
      boardId,
      columnId,
      cardId,
    } = (req.params as unknown) as RemoveCardRequestParams

    const [card] = await query<Card[]>(
      `SELECT * FROM card WHERE id=${escape(cardId)}`
    )

    if (!card) {
      res.sendStatus(404)
      return
    }

    connection.beginTransaction(async (err) => {
      if (err) throw err

      try {
        await query<MysqlInsertOrUpdateResult>(
          `UPDATE card SET isDeleted=1, previousCardId=null WHERE id=${escape(
            cardId
          )}`
        )

        await query<MysqlInsertOrUpdateResult>(
          `UPDATE card SET previousCardId=${escape(
            card.previousCardId
          )} WHERE previousCardId=${escape(cardId)}`
        )

        const cardTitle = getCardTitle(card.content)
        createActivity({
          type: 'delete',
          boardId,
          content: `<<${cardTitle}>>가 삭제되었습니다`,
        })

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {})
          }
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    res.sendStatus(200)
  }
)

export { router as RemoveACardRouter }
