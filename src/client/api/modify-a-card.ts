import {
  ModifyCardRequestParams,
  ModifyCardRequestBody,
} from '@/server/api/modify-a-card'

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

  return res.ok
}
