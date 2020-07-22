import { Column } from '@/types/schema'
import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'
import { connection } from '../modules/connection'

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

  const name = body.name
  const previousColumnId =
    parseInt(body.previousColumnId) == body.previousColumnId
      ? parseInt(body.previousColumnId)
      : body.previousColumnId

  if (
    !boardId ||
    !columnId ||
    (!name && previousColumnId !== null && typeof previousColumnId !== 'number')
  ) {
    res.sendStatus(400)
    return
  }

  // Check if the column exists and belongs to the board
  const [column] = await query<Column[]>(`
    SELECT * from \`column\`
    WHERE
    id=${columnId}
    AND
    isDeleted=0
  `)

  if (!column || column.boardId !== boardId) {
    res.sendStatus(400)
    return
  }

  // Check if the previous column exists
  // only if the previous column id is given
  if (previousColumnId) {
    const [previousColumn] = await query<Column[]>(`
      SELECT * from \`column\`
      WHERE
      id=${previousColumnId}
      AND
      isDeleted=0
    `)

    if (!previousColumn) {
      res.sendStatus(400)
      return
    }
  }

  const [columnPointingMe] = await query<Column[]>(`
    SELECT * FROM \`column\`
    WHERE
    previousColumnId = ${escape(column.id)}
  `)

  connection.beginTransaction(async (err) => {
    if (err) throw err

    try {
      if (columnPointingMe && previousColumnId) {
        // Update card which was pointing me
        await query(`
          UPDATE \`column\`
          SET
          previousColumnId = ${escape(column.previousColumnId)}
          WHERE
          id = ${escape(columnPointingMe.id)}
        `)

        // Update card which was pointing the card
        // which will be newly pointed by me
        await query(`
          UPDATE \`column\`
          SET
          previousColumnId = ${escape(column.id)}
          WHERE
          previousColumnId = ${columnPointingMe.id}
        `)
      }

      // Update mine
      await query(`
        UPDATE \`column\`
        SET
        ${name ? `name = ${escape(name)}` : ''}
        ${
          previousColumnId
            ? `${name ? ',' : ''} previousColumnId = ${escape(
                previousColumnId
              )}`
            : ''
        }
        WHERE
        id = ${escape(column.id)}
      `)

      console.log(`
      UPDATE \`column\`
      SET
      ${name ? `name = ${escape(name)}` : ''}
      ${
        previousColumnId
          ? `${name ? ',' : ''} previousColumnId = ${escape(previousColumnId)}`
          : ''
      }
      WHERE
      id = ${escape(column.id)}
    `)

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

  // TODO: Create an activity after the modification

  res.sendStatus(200)
})

export { router as modifyAColumnRouter }
