import './styles/globalstyle.scss'
import './styles/page.scss'

import './scripts/card-dnd'
import './scripts/column-dnd'

import './scripts/init.ts'
import './scripts/column.ts'
import './scripts/card.ts'
import './scripts/activity.ts'

import './scripts/color-scheme.ts'
import { resetDatabaseAPI } from './api/reset-database'

import io from 'socket.io-client'
import {
  createCardClient,
  modifyCardClient,
  removeCardClient,
} from './scripts/card-handlers'
import { moveCardClient } from './scripts/card-dnd'

function reset() {
  resetDatabaseAPI(
    parseInt(document.querySelector('.app').getAttribute('board-id'))
  ).then(() => {
    window.location.reload()
  })
}

window.addEventListener('load', () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'z' && e.metaKey && e.shiftKey) {
      reset()
    }
  })

  document
    .querySelector<HTMLDivElement>('.reset')
    .addEventListener('click', reset)
})

export const socket = io.connect(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:12100'
    : 'https://todo.woowahan.dev'
)

socket.on('card', ([data]) => {
  const { type, payload } = data

  switch (type) {
    case 'create': {
      createCardClient(payload.columnId, payload.cardId, payload.content)
      break
    }
    case 'modify': {
      modifyCardClient(payload.cardId, payload.content)
      break
    }
    case 'move': {
      moveCardClient(payload.cardId, payload.columnId, payload.previousCardId)
      break
    }
    case 'remove': {
      removeCardClient(payload.cardId)
      break
    }
  }
})
