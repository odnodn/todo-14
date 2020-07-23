import {
  generateCard,
  generateNewCardForm,
} from '@/client/scripts/html-generator'

import { createACardAPI } from '@/client/api/create-a-card'

import { eventCollector } from '@/client/utils/event-collector'

import { CardData } from '../card'

//  textarea 입력에 따라 카드추가 버튼 활성/비활성화
const textAreaKeyupHandler = (e) => {
  const okBtn = document.querySelector('.card-btn.add')

  const value = e.target.value.trim()
  if (!value) {
    okBtn.setAttribute('disabled', 'true')
  } else {
    okBtn.removeAttribute('disabled')
  }
}

// '새 카드 등록(+)' 버튼 클릭
const createCardFormHandler = ({ columnElm }: Pick<CardData, 'columnElm'>) => {
  const cardContainerElem = columnElm.querySelector('.cards-container')

  const newCardFormElm = generateNewCardForm({ content: '' })
  const textAreaElm = newCardFormElm.querySelector('textarea')

  cardContainerElem.prepend(newCardFormElm)
  textAreaElm.focus()
  eventCollector.add(textAreaElm, 'keyup', textAreaKeyupHandler)
}

// '추가' 확인
const createCardHandler = async ({
  cardFormElm,
  ids,
}: Pick<CardData, 'cardFormElm' | 'ids'>) => {
  const textAreaElm = cardFormElm.querySelector('textarea')
  const content = textAreaElm.value.trim()
  if (!content) return

  const [boardId, columnId] = ids

  const newCard = await createACardAPI({
    urlParam: { boardId, columnId },
    bodyParam: { content },
  })
  const newCardElm = generateCard({ id: newCard.id, content })

  cardFormElm.parentElement.prepend(newCardElm)
  cardFormElm.remove()

  eventCollector.remove(textAreaElm, 'keyup')
}

export { createCardFormHandler, createCardHandler }
