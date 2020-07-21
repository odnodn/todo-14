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

    // 도착지 아래 카드
    // const [prevCard] = await query(
    //   `SELECT * FROM card WHERE previousCardId=${escape(previousCardId)}`
    // )

    if (previousCardId) {
      await query(
        `UPDATE card SET previousCardId=${escape(
          targetCard.id
        )} WHERE previousCardId=${escape(previousCardId)}`
      )
    } else {
      // const where = !previousCardId
      // ? `ISNULL(previousCardId) AND columnId=${escape(columnId)}`
      // : `id=${escape(targetCard.id)}`

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

  // let existNull = false

  // orderList.map(({ id, previousCardId, fromColumnId, toColumnId }) => {
  //   if (existNull) return

  //   if (!id || !previousCardId || !fromColumnId || !toColumnId) {
  //     existNull = true
  //   }
  // })

  // if (existNull) {
  //   res.sendStatus(404)
  //   return
  // }

  // let queryFailed = false

  // orderList.map(async ({ id, previousCardId, fromColumnId, toColumnId }) => {
  //   if (queryFailed) return

  //   const { affectedRows } = await query<MysqlInsertOrUpdateResult>(`
  //     UPDATE card SET columnId=${escape(toColumnId)}, previousCardId=${escape(
  //     previousCardId
  //   )} WHERE id=${escape(id)} AND columnId=${escape(fromColumnId)}`)

  //   if (!affectedRows) queryFailed = true
  // })

  // if (queryFailed) {
  //   res.sendStatus(404)
  //   return
  // }

  res.sendStatus(200)
})

export { router as modifyACardsOrderRouter }
