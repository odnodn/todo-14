import { ModifyCardOrderRequestBody } from '@/server/api/modify-cards-order'

export const modifyCardsOrderAPI = async ({
  bodyParam,
}: {
  bodyParam: ModifyCardOrderRequestBody
}): Promise<boolean> => {
  const res = await fetch(`/board/order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyParam),
  })

  return res.ok
}
