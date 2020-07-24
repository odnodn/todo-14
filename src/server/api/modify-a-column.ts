import { Column } from '@/types/schema'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'
import { connection } from '../modules/connection'
import { createActivity } from '../modules/create-an-activity'

const router = express.Router()

export type ModifyColumnRequestParams = {
  boardId: number
  columnId: number
}

export type ModifyColumnRequestBody = {
  name: string
  previousColumnId: number
}

router.put('/board/:boardId/column/:columnId', async (req, res) => {
  const { params, body } = req

  const boardId = parseInt(params.boardId)
  const columnId = parseInt(params.columnId)

  const newName = body.name?.trim() as string
  const previousColumnId =
    parseInt(body.previousColumnId) == body.previousColumnId
      ? parseInt(body.previousColumnId)
      : body.previousColumnId

  if (
    !boardId ||
    !columnId ||
    (!newName &&
      previousColumnId !== null &&
      typeof previousColumnId !== 'number')
  ) {
    res.sendStatus(400)
    return
  }

  // Check if the column exists and belongs to the board
  const [column] = await query<Column[]>(`
    SELECT * from \`column\`
    WHERE
    id=${escape(columnId)}
    AND
    isDeleted=0
  `)

  if (!column || column.boardId !== boardId) {
    res.sendStatus(400)
    return
  }

  let previousColumn: Column = null

  // Check if the previous column exists
  // only if the previous column id is given
  if (previousColumnId) {
    previousColumn = (
      await query<Column[]>(`
      SELECT * FROM \`column\`
      WHERE
      id=${escape(previousColumnId)}
      AND
      isDeleted = 0
    `)
    )[0]

    if (!previousColumn) {
      res.sendStatus(400)
      return
    }
  }

  const shouldUpdateOrder = previousColumnId !== undefined

  let originalPreviousColumn: Column = null

  if (shouldUpdateOrder && column.previousColumnId) {
    originalPreviousColumn = (
      await query<Column[]>(`
      SELECT * FROM \`column\`
      WHERE
      id=${escape(column.previousColumnId)}
      AND
      isDeleted = 0
    `)
    )[0]
  }

  connection.beginTransaction(async (err) => {
    if (err) throw err

    try {
      if (shouldUpdateOrder) {
        await query(`
          UPDATE \`column\` SET
          previousColumnId = ${escape(column.previousColumnId)}
          WHERE
          previousColumnId = ${escape(column.id)}
        `)

        if (previousColumnId) {
          await query(`
            UPDATE \`column\` SET
            previousColumnId = ${escape(column.id)}
            WHERE
            previousColumnId = ${escape(previousColumnId)}
          `)
        } else {
          await query(`
            UPDATE \`column\` SET
            previousColumnId = ${escape(column.id)}
            WHERE
            ISNULL(previousColumnId)
            AND
            boardId = ${escape(boardId)}
          `)
        }
      }

      // Update mine
      await query(`
        UPDATE \`column\`
        SET
        ${newName ? `name = ${escape(newName)}` : ''}
        ${
          shouldUpdateOrder
            ? `${newName ? ',' : ''} previousColumnId = ${escape(
                previousColumnId
              )}`
            : ''
        }
        WHERE
        id = ${escape(column.id)}
      `)

      if (newName !== column.name) {
        await createActivity({
          type: 'modify',
          boardId,
          content: `컬럼의 이름이 [[${column.name}]]에서 [[${newName}]]로 수정되었습니다.`,
        })
      } else if (shouldUpdateOrder) {
        if (previousColumnId !== column.previousColumnId) {
          await createActivity({
            type: 'move',
            boardId,
            content: `컬럼이 이동되었습니다.`,
            // columnId,
            // from: `${originalPreviousColumn?.id ?? null},${
            //   originalPreviousColumn?.name ?? ''
            // }`,
            // to: `${previousColumn?.id ?? null},${previousColumn?.name ?? ''}`,
          })
        }
      }

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
})

export { router as modifyAColumnRouter }
