const getElementIds = (elm: HTMLElement): [number, number, number] => {
  const boardId =
    parseInt(elm.closest('.app')?.getAttribute('data-board-id')) || null
  const columnId =
    parseInt(elm.closest('.column')?.getAttribute('data-column-id')) || null
  const cardId =
    parseInt(elm.closest('.card')?.getAttribute('data-card-id')) || null

  return [boardId, columnId, cardId]
}

const getPreviousCardNumber = (cardElm: HTMLElement): number => {
  return (
    parseInt(cardElm.previousElementSibling?.getAttribute('data-card-id')) ||
    null
  )
}

const getCardData = (cardElm: HTMLElement) => {
  const title = cardElm.querySelector('.card-title').textContent
  const body = cardElm.querySelector('.card-body').textContent
  const content = [title, body].join('\n').trim()

  return {
    columnId: parseInt(
      cardElm.closest('.column').getAttribute('data-column-id')
    ),
    content,
    icon: null,
    previousCardId:
      parseInt(cardElm.previousElementSibling?.getAttribute('data-card-id')) ||
      null,
  }
}

export { getElementIds, getPreviousCardNumber, getCardData }
