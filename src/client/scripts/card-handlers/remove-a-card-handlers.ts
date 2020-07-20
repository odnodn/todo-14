import { removeACardAPI } from '@/client/api/remove-a-card'
import { CardData } from '../card'

// '삭제'
const deleteCardHandler = async ({
  cardElm,
  ids,
}: Pick<CardData, 'cardElm' | 'ids'>) => {
  const [boardId, columnId, cardId] = ids

  const success = await removeACardAPI({
    urlParam: { boardId, columnId, cardId },
  })
  success && cardElm.remove()
}

export { deleteCardHandler }
