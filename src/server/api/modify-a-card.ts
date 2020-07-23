import express from 'express'

import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'
import { MysqlInsertOrUpdateResult } from '@/types/query'
import { getCardTitle, parseContent } from '@/client/utils/content-parser'
import { createActivity } from '../modules/create-an-activity'
import { Card } from '@/types/response'

const router = express.Router()

export type ModifyCardRequestParams = {
  boardId: number
  columnId: number
  cardId: number
}

export type ModifyCardRequestBody = {
  content: string
  icon: string
  columnId: number
  previousCardId: number
}

router.put(
  '/board/:boardId/column/:columnId/card/:cardId',
  async (req, res) => {
    const {
      boardId,
      cardId,
    } = (req.params as unknown) as ModifyCardRequestParams
    const {
      content,
      icon,
      columnId,
      previousCardId,
    } = req.body as ModifyCardRequestBody

    // icon, previousCardId는 not null이 아니기 때문에 제외
    if (!content || !columnId) {
      res.sendStatus(400)
      return
    }

    const [card] = await query<Card[]>(
      `SELECT * FROM card WHERE id=${escape(cardId)} AND columnId=${escape(
        columnId
      )} AND isDeleted=0`
    )

    if (!card) {
      res.sendStatus(400)
      return
    }

    const { affectedRows } = await query<MysqlInsertOrUpdateResult>(`UPDATE card
    SET content=${escape(content)}, icon=${escape(icon)}, columnId=${escape(
      columnId
    )}, previousCardId=${escape(previousCardId)}
    WHERE id=${cardId}`)

    const [prevCardTitle, prevBody] = parseContent(card.content)
    const [cardTitle, body] = parseContent(content)

    const activityContents = []
    if (prevCardTitle !== cardTitle) {
      activityContents.push(
        `카드 제목이 <<${prevCardTitle}>>에서 <<${cardTitle}>>로`
      )
    }

    if (prevBody !== body) {
      activityContents.push(
        `카드 내용이 <<${prevCardTitle}>>에서 <<${cardTitle}>>로`
      )
    }

    createActivity({
      type: 'modify',
      boardId,
      content: `${activityContents.join(', ')} 수정되었습니다.`,
    })

    if (!affectedRows) {
      res.sendStatus(400)
      return
    }

    res.sendStatus(200)
  }
)

export { router as modifyACardRouter }
