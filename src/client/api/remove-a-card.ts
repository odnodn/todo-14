import { RemoveCardRequestParams } from '@/server/api/remove-a-card'
import { socket } from '../main'

export const removeACardAPI = async ({
  urlParam,
}: {
  urlParam: RemoveCardRequestParams
}): Promise<boolean> => {
  const res = await fetch(
    `/board/${urlParam.boardId}/column/${urlParam.columnId}/card/${urlParam.cardId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  socket.emit('card', {
    type: 'remove',
    payload: {
      boardId: urlParam.boardId,
      columnId: urlParam.columnId,
      cardId: urlParam.cardId,
    },
  })

  return res.ok
}
