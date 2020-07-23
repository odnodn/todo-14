import express from 'express'

import { escape } from '../modules/escape'
import { query } from '@/server/modules/query'
import { createActivity } from '@/server/modules/create-an-activity'

import { MysqlInsertOrUpdateResult } from '@/types/query'
import { Card as CardReponse } from '@/types/response'
import { Card as CardSchema, User as UserSchema, Column } from '@/types/schema'
import { getCardTitle } from '@/client/utils/content-parser'

const router = express.Router()

export type CreateCardRequestParams = {
  boardId: number
  columnId: number
}

export type CreateCardRequestBody = {
  content: string
}

export type CreateCardResponseData = {
  card: CardReponse
}

const composeCardResponse = (
  card: CardSchema,
  user: UserSchema
): CreateCardResponseData => ({
  card: {
    id: card.id,
    user: {
      id: user.id,
      username: user.username,
      picture: user.picture,
      createdAt: user.createdAt,
    },
    content: card.content,
    icon: card.icon,
    previousCardId: card.previousCardId,
    createdAt: card.createdAt,
    editedAt: card.editedAt,
  },
})

router.post('/board/:boardId/column/:columnId/card', async (req, res) => {
  const { content } = req.body as CreateCardRequestBody
  const {
    boardId,
    columnId,
  } = (req.params as unknown) as CreateCardRequestParams
  if (!content) {
    res.sendStatus(400)
    return
  }

  // TODO: get from session
  const userId = 1

  const { insertId } = await query<
    MysqlInsertOrUpdateResult
  >(`INSERT INTO card (columnId, userId, content)
  VALUES(${escape(columnId)}, ${escape(userId)}, ${escape(content)} )`)

  await query<MysqlInsertOrUpdateResult>(
    `UPDATE card SET previousCardId=${escape(insertId)} WHERE columnId=${escape(
      columnId
    )} AND ISNULL(previousCardId) AND id<>${escape(insertId)}`
  )

  const [card] = await query<CardSchema[]>(
    `SELECT * FROM card WHERE id=${escape(insertId)}`
  )

  const [column] = await query<Column[]>(
    `SELECT * FROM \`column\` WHERE id=${escape(columnId)}`
  )

  const [user] = await query<UserSchema[]>(
    `SELECT * FROM user WHERE id=${escape(userId)}`
  )

  const cardTitle = getCardTitle(card.content)
  createActivity({
    type: 'add',
    boardId,
    content: `<<${cardTitle}>>가 [[${column.name}]]에 추가되었습니다.`,
  })

  if (!card || !user) {
    res.sendStatus(500)
    return
  }

  // type guarantee
  const result = composeCardResponse(card, user)

  res.json(result)
})

export { router as createACardRouter }
