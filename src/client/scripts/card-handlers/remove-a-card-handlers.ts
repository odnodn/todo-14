import { removeACardAPI } from '@/client/api/remove-a-card'
import { CardData } from '../card'
import { updateColumnBadgeCount } from '@/client/modules/update-column-badge-count'

export function removeCardClient(cardId: number) {
  const removeCardElm = document.querySelector<HTMLElement>(
    `[data-card-id="${cardId}"]:not(.new)`
  )
  if (!removeCardElm) return

  removeCardElm.remove()
}

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

  success && removeCardClient(cardId)

  updateColumnBadgeCount(columnElm)
}

export { deleteCardHandler }
