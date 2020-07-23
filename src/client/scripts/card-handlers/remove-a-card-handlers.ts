import { removeACardAPI } from '@/client/api/remove-a-card'
import { CardData } from '../card'
import { updateColumnBadgeCount } from '@/client/modules/update-column-badge-count'

// '삭제'
const deleteCardHandler = async ({
  cardElm,
  ids,
}: Pick<CardData, 'cardElm' | 'ids'>) => {
  const [boardId, columnId, cardId] = ids

  const success = await removeACardAPI({
    urlParam: { boardId, columnId, cardId },
  })

  const columnElm = cardElm.closest<HTMLElement>('.column')

  success && cardElm.remove()

  updateColumnBadgeCount(columnElm)
}

export { deleteCardHandler }
