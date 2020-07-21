import { eventCollector } from '@/client/utils/event-collector'

const COLUMN_MARGIN_LEFT = 25
const COLUMN_WIDTH = 353
const COLUMN_FULL_WIDTH = COLUMN_MARGIN_LEFT + COLUMN_WIDTH

const getTransformX = (el: HTMLElement): number => {
  return parseInt(el?.style?.transform?.split('px')[0]?.split('(')[1]) || 0
}

window.addEventListener('pointerdown', (e) => {
  const target = e.target as HTMLElement

  const originalColumn = target.closest('.column:not(.new)') as HTMLElement
  const originalHeader = target.closest('.column-header') as HTMLElement

  if (!originalHeader) return

  const initialX = e.pageX
  const initialY = e.pageY

  const longPressTimeOut = setTimeout(() => {
    document.body.classList.add('hovered')

    Array.from(originalColumn.parentNode.children).map((el, idx) => {
      el.setAttribute('from-index', `${idx}`)
      el.setAttribute('to-index', `${idx}`)
    })

    // Create a ghost column which is moving along the pointer
    const ghostColumn = originalColumn.cloneNode(true) as HTMLElement
    const placeholder = originalColumn.cloneNode() as HTMLElement

    // Initialize the ghost card and placeholder CSS properties and class name
    ghostColumn.style.pointerEvents = placeholder.style.pointerEvents = 'none'
    ghostColumn.style.position = 'fixed'
    ghostColumn.style.margin = '0px'
    ghostColumn.style.width = placeholder.style.width = `${originalColumn.clientWidth}px`
    ghostColumn.style.height = placeholder.style.height = `${originalColumn.clientHeight}px`

    const columnRect = originalColumn.getBoundingClientRect()

    // Style the placeholder
    placeholder.classList.add('placeholder')
    placeholder.style.position = 'absolute'
    placeholder.style.left = '0px'
    placeholder.style.margin = '0px'
    placeholder.style.transform = `translate3d(${columnRect.left}px, 0, 0)`

    // Prepend placeholder
    originalColumn.parentElement.prepend(placeholder)

    const placeholderRect = placeholder.getBoundingClientRect()

    const originalColumnLeft = placeholderRect.left
    const originalColumnTop = placeholderRect.top

    // Style the ghost card
    ghostColumn.classList.add('ghost')
    ghostColumn.style.transition = 'box-shadow 200ms ease, transform 200ms ease'
    ghostColumn.style.top = `${placeholderRect.top}px`
    ghostColumn.style.left = `${placeholderRect.left}px`
    ghostColumn.style.zIndex = '9999'
    ghostColumn.style.opacity = '0.9'

    // Insert into the DOM
    originalColumn.parentElement.appendChild(ghostColumn)

    // Trick for activating transitions
    ghostColumn.getBoundingClientRect()

    ghostColumn.style.boxShadow = '0 22px 60px rgba(0, 0, 0, 0.3)'
    ghostColumn.style.transform = ghostColumn.style.webkitTransform =
      'scale(1.05)'

    // Hide the original card
    originalColumn.style.visibility = 'hidden'

    eventCollector.add(window, 'pointermove', (e: MouseEvent) => {
      const deltaX = e.pageX - initialX
      const deltaY = e.pageY - initialY

      ghostColumn.style.top = `${originalColumnTop + deltaY}px`
      ghostColumn.style.left = `${originalColumnLeft + deltaX}px`

      const ghostColumnRect = ghostColumn.getBoundingClientRect()

      // Detect a card based on the coordinate of
      // the center of the ghost card
      const hoveredColumn = document
        .elementFromPoint(
          ghostColumnRect.left + ghostColumnRect.width / 2,
          ghostColumnRect.top + ghostColumnRect.height / 2
        )
        ?.closest('.column:not(.new)') as HTMLElement
      //   ||
      // (document
      //   .elementFromPoint(e.pageX, e.pageY)
      //   ?.closest('.column:not(.new)') as HTMLElement)

      // if (!hoveredColumn || document.body.classList.contains('hovered'))
      if (!hoveredColumn || hoveredColumn.classList.contains('animating'))
        return

      const currentPlaceholderLeft = getTransformX(placeholder)

      const fromIdx = parseInt(placeholder.getAttribute('from-index'))
      const toIdx = parseInt(hoveredColumn.getAttribute('to-index'))

      // 왼쪽에서 오른쪽으로 움직일 때
      if (fromIdx !== toIdx) {
        const step = toIdx - fromIdx
        hoveredColumn.classList.add('animating')

        placeholder.setAttribute('from-index', `${toIdx}`)
        placeholder.setAttribute('to-index', `${toIdx}`)

        Array.from(originalColumn.parentNode.children).forEach(
          (elm: HTMLElement) => {
            if (
              elm.classList.contains('ghost') ||
              elm.classList.contains('placeholder') ||
              elm.classList.contains('new') ||
              elm.classList.contains('spacer')
            )
              return

            const columnIdx = parseInt(elm.getAttribute('to-index'))

            if (columnIdx <= toIdx && columnIdx > fromIdx) {
              elm.setAttribute('to-index', `${columnIdx - 1}`)

              const translateX = getTransformX(elm)
              elm.style.transform = `translate3d(${
                translateX - COLUMN_FULL_WIDTH
              }px, 0, 0)`
            }

            if (columnIdx >= toIdx && columnIdx < fromIdx) {
              elm.setAttribute('to-index', `${columnIdx + 1}`)
              const translateX = getTransformX(elm)
              elm.style.transform = `translate3d(${
                translateX + COLUMN_FULL_WIDTH
              }px, 0, 0)`
            }
          }
        )

        placeholder.style.transform = `translate3d(${
          currentPlaceholderLeft + COLUMN_FULL_WIDTH * step
        }px, 0, 0)`

        eventCollector.add(hoveredColumn, 'transitionend', (e) => {
          hoveredColumn.classList.remove('animating')
          eventCollector.remove(hoveredColumn, 'transitionend')
        })

        // const hoveredColumnLeft = getTransformX(hoveredColumn)
        // hoveredColumn.style.transform = `translate3d(${
        //   hoveredColumnLeft - COLUMN_FULL_WIDTH * step
        // }px, 0, 0)`
      }
      //   if (fromIdx > toIdx) {
      //     {
      //       hoveredColumn.classList.add('animating')

      //       const prevIdx = parseInt(hoveredColumn.getAttribute('to-index'))
      //       // hoveredColumn.setAttribute('to-index', `${prevIdx + 1}`)
      //       hoveredColumn.setAttribute('to-index', `${prevIdx + 1}`)
      //       placeholder.setAttribute('from-index', `${toIdx}`)
      //       placeholder.setAttribute('to-index', `${toIdx}`)

      //       eventCollector.add(hoveredColumn, 'transitionend', (e) => {
      //         hoveredColumn.classList.remove('animating')
      //         eventCollector.remove(hoveredColumn, 'transitionend')
      //       })

      //       placeholder.style.transform = `translate3d(${
      //         currentPlaceholderLeft - COLUMN_FULL_WIDTH
      //       }px, 0, 0)`

      //       const hoveredColumnLeft = getTransformX(hoveredColumn)
      //       hoveredColumn.style.transform = `translate3d(${
      //         hoveredColumnLeft + COLUMN_FULL_WIDTH
      //       }px, 0, 0)`
      //     }
      //   }
    })

    eventCollector.add(window, 'pointerup', (e: MouseEvent) => {
      document.body.classList.remove('hovered')
      eventCollector.remove(window, 'pointermove')

      const fromIdx = placeholder.getAttribute('from-index')
      const toIdx = placeholder.getAttribute('to-index')

      ghostColumn.style.transition = `top 200ms ease, left 200ms ease, box-shadow 200ms ease, transform 200ms ease`

      ghostColumn.style.boxShadow = 'none'
      ghostColumn.style.transform = ghostColumn.style.webkitTransform = ''

      const placeholderRect = placeholder.getBoundingClientRect()

      ghostColumn.style.top = `${placeholderRect.top}px`
      ghostColumn.style.left = `${placeholderRect.left}px`

      ghostColumn.addEventListener('transitionend', function tec() {
        ghostColumn.remove()
        placeholder.remove()

        ghostColumn.removeEventListener('transitionend', tec)

        // ghostColumn.remove()
        originalColumn.setAttribute('to-index', toIdx)

        const result = Array.from(originalColumn.parentNode.children)
          .sort((a, b) => {
            return (
              parseInt(a.getAttribute('to-index')) -
              parseInt(b.getAttribute('to-index'))
            )
          })
          .map((elm) => {
            const clonedElm = elm.cloneNode(true) as HTMLElement
            clonedElm.style.transform = null
            clonedElm.removeAttribute('from-index')
            clonedElm.removeAttribute('to-index')
            clonedElm.style.visibility = null
            return clonedElm
          })

        const parentElm = originalColumn.parentElement

        parentElm.innerHTML = ``
        result.forEach((elm) => parentElm.appendChild(elm))
      })
    })
  }, 200)

  eventCollector.add(window, 'pointerup', (e: MouseEvent) => {
    clearTimeout(longPressTimeOut)
    eventCollector.remove(window, 'pointerup')
  })

  eventCollector.add(window, 'pointermove', (e: MouseEvent) => {
    const absDeltaX = Math.abs(e.pageX - initialX)
    const absDeltaY = Math.abs(e.pageY - initialY)

    const absDistance = Math.sqrt(absDeltaX ** 2 + absDeltaY ** 2)

    if (absDistance > 3) {
      clearTimeout(longPressTimeOut)
      eventCollector.remove(window, 'pointermove')
    }
  })
})
