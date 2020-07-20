import {
  getElementIds,
  getPreviousCardNumber,
} from '@/client/scripts/get-data-id'

import {
  createCardFormHandler,
  createCardHandler,
  editCardHandler,
  editCardFormHandler,
  deleteCardHandler,
} from './card-handlers'

// '취소'
const cancelCreateOrEditHandler = (cardFormElm: HTMLElement) => {
  cardFormElm.remove()

  document.querySelector('.card.hide')?.classList.remove('hide')
}

window.addEventListener('click', (e) => {
  const target = e.target as HTMLElement

  const ids = getElementIds(target)

  const columnElm = target.closest('.column') as HTMLElement

  const cardElm = target.closest('.card') as HTMLElement
  const cardFormElm = target.closest('.card.new') as HTMLElement

  const createCardBtn = target.closest(
    '.action-btn.new-card-btn'
  ) as HTMLElement
  const deleteCardBtnElm = target.closest('.delete-card-btn') as HTMLElement

  const editOkBtn = target.closest('.card-btn.edit') as HTMLElement
  const createCardOKBtn = target.closest('.card-btn.add') as HTMLElement
  const cancelBtn = target.closest('.card-btn.cancel') as HTMLElement

  if (createCardBtn) {
    createCardFormHandler(columnElm)
    return
  }

  if (createCardOKBtn) {
    createCardHandler(columnElm, cardFormElm, ids)
    return
  }

  if (editOkBtn) {
    const previousCardId = getPreviousCardNumber(cardElm)
    editCardHandler(cardFormElm, previousCardId, ids)
    return
  }

  if (cancelBtn) {
    cancelCreateOrEditHandler(cardFormElm)
    return
  }

  if (deleteCardBtnElm) {
    deleteCardHandler(cardElm, ids)
    return
  }

  if (cardElm && !cardFormElm) {
    editCardFormHandler(columnElm, cardElm, ids)
    return
  }
})
