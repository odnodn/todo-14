import { escape } from '../modules/escape'
import express from 'express'
import { query } from '../modules/query'

const router = express.Router()

export type GetBoardDataResponseData = {
  board: {
    id: number
    name: string
    columns: {
      id: number
      name: string
      previousColumnId: number
      createdAt: string
      cards: {
        id: number
        content: string
        icon: string
        previousCardId: number
        createdAt: string
        editedAt: string
      }[]
    }[]
  }
}

function mapSort<T extends []>(linkedList: T, previousKey: string): T {
  const sortedList = [] as T
  const map = new Map()
  let currentId = null

  // index the linked list by previous_item_id
  for (let i = 0; i < linkedList.length; i++) {
    const item = linkedList[i]

    if (item[previousKey] === null) {
      // first item
      currentId = item['id']
      sortedList.push(item)
    } else {
      map.set(item[previousKey], i)
    }
  }

  while (sortedList.length < linkedList.length) {
    // get the item with a previous item ID referencing the current item
    const nextItem = linkedList[map.get(currentId)]
    sortedList.push(nextItem)
    currentId = nextItem['id']
  }

  return sortedList
}

router.get('/board/:boardId', async ({ params }, res) => {
  const boardId = parseInt(params.boardId)

  if (!boardId) {
    res.sendStatus(400)
    return
  }

  // TODO: !!! Use correct types

  const [board] = await query(`SELECT * FROM board WHERE id=${escape(boardId)}`)

  if (!board) {
    res.json({
      board: null,
    })
    return
  }

  const columns = (await query(`
    SELECT id, name, previousColumnId, createdAt
    FROM \`column\`
    WHERE boardId = ${escape(boardId)}
    AND isDeleted = 0
  `)) as []

  const sortedColumns = mapSort(columns, 'previousColumnId')

  for (const column of sortedColumns) {
    const cards = (await query(`
      SELECT id, content, icon, previousCardId, createdAt, editedAt
      FROM card
      WHERE columnId=${(column as any).id}
      AND isDeleted = 0
    `)) as []

    const sortedCards = mapSort(cards, 'previousCardId')

    ;(column as any)['cards'] = sortedCards
  }

  const responseData: GetBoardDataResponseData = {
    board: {
      ...board,
      columns,
    },
  }

  res.json(responseData)
})

export { router as getABoardDataRouter }
