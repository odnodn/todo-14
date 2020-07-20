import { generateEditCardForm } from '@/client/scripts/html-generator'

import { parseContent } from '@/client/utils/content-parser'
import { eventCollector } from '@/client/utils/event-collector'

import { modifyACardAPI } from '@/client/api/modify-a-card'

import { CardData } from '../card'

const editCardOkBtnClickHandler = (e) => {
  e.stopPropagation()
  const editBtn = document.querySelector('.card-btn.edit')

  const value = e.target.value.trim()
  if (!value) {
    editBtn.setAttribute('disabled', 'true')
  } else {
    editBtn.removeAttribute('disabled')
  }
}

// '수정' 확인
const editCardHandler = async (
  { cardFormElm, ids }: Pick<CardData, 'cardFormElm' | 'ids'>,
  previousCardId: number
) => {
  const textAreaElm = cardFormElm.querySelector('textarea')
  const content = textAreaElm.value.trim()
  if (!content) return

  const cardElm = document.querySelector('.card.hide')

  const [boardId, columnId, cardId] = ids

  const success = modifyACardAPI({
    urlParam: { boardId, columnId, cardId },
    bodyParam: { content, columnId, icon: null, previousCardId },
  })

  if (!success) return

  const [title, body] = parseContent(content)
  cardElm.querySelector('.card-title').textContent = title
  cardElm.querySelector('.card-body').textContent = body

  cardFormElm.remove()
  cardElm.classList.remove('hide')

  eventCollector.remove(textAreaElm, 'keyup')
}

// '카드 수정(카드 클릭)'
const editCardFormHandler = ({
  columnElm,
  cardElm,
  ids,
}: Pick<CardData, 'columnElm' | 'cardElm' | 'ids'>) => {
  const title = cardElm.querySelector('.card-title').textContent
  const body = cardElm.querySelector('.card-body').textContent
  const content = [title, body].join('\n').trim()

  const [_1, _2, cardId] = ids
  const newCardElm = generateEditCardForm({ content, id: cardId })
  const cardContainerElem = columnElm.querySelector('.cards-container')
  cardContainerElem.prepend(newCardElm)

  cardElm.classList.add('hide')

  const textAreaElm = newCardElm.querySelector('textarea')
  eventCollector.add(textAreaElm, 'keyup', editCardOkBtnClickHandler)
}

export { editCardHandler, editCardFormHandler }
