import {
  CreateCardRequestParams,
  CreateCardRequestBody,
  CreateCardResponseData,
} from '@/server/api/create-a-card'

export const createACardAPI = async ({
  urlParam,
  bodyParam,
}: {
  urlParam: CreateCardRequestParams
  bodyParam: CreateCardRequestBody
}): Promise<CreateCardResponseData['card']> => {
  const res = await fetch(
    `/board/${urlParam.boardId}/column/${urlParam.columnId}/card`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParam),
    }
  )

  if (!res.ok) return null

  const { card } = (await res.json()) as CreateCardResponseData

  return card
}
