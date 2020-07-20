import { removeACardAPI } from '@/client/api/remove-a-card'

// '삭제'
const deleteCardHandler = async (
  cardElm: HTMLElement,
  ids: [number, number, number]
) => {
  const [boardId, columnId, cardId] = ids

  const success = await removeACardAPI({
    urlParam: { boardId, columnId, cardId },
  })
  success && cardElm.remove()
}

export { deleteCardHandler }
