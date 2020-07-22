export async function modifyColumn({
  boardId,
  columnId,
  data,
}: {
  boardId: number
  columnId: number
  data: {
    name?: string
    previousColumnId?: number
  }
}) {
  const res = await fetch(`/board/${boardId}/column/${columnId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return res.ok
}
