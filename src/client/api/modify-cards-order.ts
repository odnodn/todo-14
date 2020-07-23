import {
  ModifyCardOrderRequestParams,
  ModifyCardOrderRequestBody,
} from '@/server/api/modify-cards-order'

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

  return res.ok
}
