export const getActivitiesListAPI = async ({ urlParam }: { urlParam }) => {
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
