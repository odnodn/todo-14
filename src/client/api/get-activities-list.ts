import {
  GetActivitiesListRequestParams,
  GetActivitiesListResponseData,
} from '@/server/api/get-activities-list'

export const getActivitiesListAPI = async ({
  urlParam,
}: {
  urlParam: GetActivitiesListRequestParams
}): Promise<GetActivitiesListResponseData['activities']> => {
  const res = await fetch(`/board/${urlParam.boardId}/activity`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) return null

  const { activities } = await res.json()

  return activities
}
