import {
  ModifyCardOrderRequestParams,
  ModifyCardOrderRequestBody,
} from '@/server/api/modify-cards-order'
import { socket } from '../main'

export const modifyCardsOrderAPI = async ({
  urlParam,
  bodyParam,
}: {
  urlParam: ModifyCardOrderRequestParams
  bodyParam: ModifyCardOrderRequestBody
}): Promise<boolean> => {
  const res = await fetch(`/board/${urlParam.boardId}/order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyParam),
  })

  socket.emit('card', {
    type: 'move',
    payload: {
      boardId: urlParam.boardId,
      columnId: bodyParam.columnId,
      cardId: bodyParam.cardId,
      previousCardId: bodyParam.previousCardId,
    },
  })

  return res.ok
}
