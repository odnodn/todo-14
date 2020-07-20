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

export type CardData = {
  ids: [number, number, number]

  columnElm: HTMLElement

  cardElm: HTMLElement
  cardFormElm: HTMLElement

  createCardBtnElm: HTMLElement
  deleteCardBtnElm: HTMLElement
  editOkBtnElm: HTMLElement
  createCardOKBtnElm: HTMLElement
  cancelBtnElm: HTMLElement
}

const getData = (target: HTMLElement): CardData => ({
  ids: getElementIds(target),

  columnElm: target.closest('.column'),

  cardElm: target.closest('.card'),
  cardFormElm: target.closest('.card.new'),

  createCardBtnElm: target.closest('.action-btn.new-card-btn'),
  deleteCardBtnElm: target.closest('.delete-card-btn'),
  editOkBtnElm: target.closest('.card-btn.edit'),
  createCardOKBtnElm: target.closest('.card-btn.add'),
  cancelBtnElm: target.closest('.card-btn.cancel'),
})

// '취소'
const cancelCreateOrEditHandler = ({
  cardFormElm,
}: Pick<CardData, 'cardFormElm'>) => {
  cardFormElm.remove()

  document.querySelector('.card.hide')?.classList.remove('hide')
}

window.addEventListener('click', (e) => {
  const target = e.target as HTMLElement

  const data = getData(target)
  const {
    cardElm,
    createCardBtnElm,
    deleteCardBtnElm,
    editOkBtnElm,
    createCardOKBtnElm,
    cancelBtnElm,
  } = data

  if (createCardBtnElm) {
    createCardFormHandler(data)
    return
  }

  if (createCardOKBtnElm) {
    createCardHandler(data)
    return
  }

  if (editOkBtnElm) {
    const previousCardId = getPreviousCardNumber(cardElm)
    editCardHandler(data, previousCardId)
    return
  }

  if (cancelBtnElm) {
    cancelCreateOrEditHandler(data)
    return
  }

  if (deleteCardBtnElm) {
    deleteCardHandler(data)
    return
  }
})

window.addEventListener('dblclick', (e) => {
  const target = e.target as HTMLElement

  const data = getData(target)
  const { cardElm, cardFormElm } = data

  if (cardElm && !cardFormElm) {
    editCardFormHandler(data)
    return
  }
})
