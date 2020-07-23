export const resetDatabaseAPI = async (boardId = 1): Promise<boolean> => {
  const res = await fetch(`/board/${boardId}/reset`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.ok
}
