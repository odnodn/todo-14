import { generateElement, generateColumn, generateCard } from './html-generator'

import { getBoardListAPI } from '@/client/api/get-boards-list'
import { getABoardDataAPI } from '@/client/api/get-a-board-data'
import { GetBoardDataResponseData } from '@/server/api/get-a-board-data'
import { updateAllColumnsBadgeCount } from '../modules/update-column-badge-count'

const { userAgent } = navigator

const isMobile =
  (userAgent.match(/Android/i) ||
    userAgent.match(/webOS/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPod/i) ||
    userAgent.match(/BlackBerry/i) ||
    userAgent.match(/Windows Phone/i)) !== null

const setMobileHeader = (id: number) => {
  const appElm = document.querySelector('.app') as HTMLElement
  const navigationElm = document.querySelector('.navigation') as HTMLElement
  const boardNameElm = document.querySelector('.board-name') as HTMLElement

  const now = new Date()
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const d = `${now.getDate()}TH`
  const m = month[now.getMonth()].toUpperCase()
  const w = weekday[now.getDay()].toUpperCase()

  const dateElm = generateElement(`
    <div class="date">
      <span class="weekday">${w}</span>${d}${' '}${m}
    </div>
    `)

  navigationElm.prepend(dateElm)

  boardNameElm.innerText = '오늘뭐하지'
  appElm.setAttribute('data-board-id', id.toString())
}

const setBoardName = (id: number, name: string) => {
  const appElm = document.querySelector('.app') as HTMLElement
  const boardNameElm = document.querySelector('.board-name') as HTMLElement

  boardNameElm.innerText = name
  appElm.setAttribute('data-board-id', id.toString())
}

const render = (board: GetBoardDataResponseData['board']) => {
  const containerElm = generateElement(
    `<main class="columns-container"></main>`
  )

  board.columns.map((column) => {
    const { id, name, cards } = column
    const columnElm = generateColumn({ id, name })

    const cardsContainerElm = columnElm.querySelector('.cards-container')

    cards.map((card) => {
      const { id, content } = card

      const cardElm = generateCard({ id, content })
      cardsContainerElm.appendChild(cardElm)
    })

    columnElm.appendChild(cardsContainerElm)
    containerElm.appendChild(columnElm)
  })

  const addColumnElem = generateElement(
    `<div class="column new">
      <button><i class="icon">plus_app_fill</i></button>
      <p>Add a Column</p>
    </div>`
  )

  const spacerElm = generateElement(`<div class="column-spacer"></div>`)

  containerElm.appendChild(addColumnElem)
  containerElm.appendChild(spacerElm)

  const app = document.querySelector('.app')
  app.appendChild(containerElm)
}

const init = async () => {
  const boards = await getBoardListAPI()
  if (!boards?.length) return

  const boardData = await getABoardDataAPI(boards[0].id)
  if (!boardData) return

  console.log(isMobile)
  isMobile
    ? setMobileHeader(boardData.id)
    : setBoardName(boardData.id, boardData.name)
  render(boardData)

  const stickyHeaderElm = document.querySelector(
    '.column-header'
  ) as HTMLElement

  document.addEventListener('sticky-change', function (e: any) {
    console.log(e.detail.stuck, e.detail.target)
  })

  stickyHeaderElm.addEventListener('stuck', function () {
    this.classList.add('is-stuck')
    // console.log('akakakk')
  })
  stickyHeaderElm.addEventListener('unstuck', function () {
    this.classList.remove('is-stuck')
    // console.log('akakakk')
  })

  updateAllColumnsBadgeCount()
}

init()
