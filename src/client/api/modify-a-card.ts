import {
  ModifyCardRequestParams,
  ModifyCardRequestBody,
} from '@/server/api/modify-a-card'
import { socket } from '../main'

export const modifyACardAPI = async ({
  urlParam,
  bodyParam,
}: {
  urlParam: ModifyCardRequestParams
  bodyParam: ModifyCardRequestBody
}): Promise<boolean> => {
  const res = await fetch(
    `/board/${urlParam.boardId}/column/${urlParam.columnId}/card/${urlParam.cardId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParam),
    }
  )

  socket.emit('card', {
    type: 'modify',
    payload: {
      boardId: urlParam.boardId,
      columnId: urlParam.columnId,
      cardId: urlParam.cardId,
      content: bodyParam.content,
    },
  })

  return res.ok
}
