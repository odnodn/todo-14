import { modifyCardsOrderAPI } from '../api/modify-cards-order'
import { updateColumnBadgeCount } from '../modules/update-column-badge-count'

function isAnimatedCard(card: HTMLElement) {
  return card && card.classList.contains('animated')
}

function isPureCard(card: HTMLElement) {
  return (
    card &&
    card.classList.contains('card') &&
    !card.classList.contains('ghost') &&
    !card.classList.contains('placeholder')
  )
}

function clearCardTransform(card: HTMLElement): void {
  if (!isAnimatedCard(card)) {
    return
  }

  card.addEventListener('transitionend', function tec() {
    card.classList.remove('animating')
    card.classList.remove('forwarded')

    card.removeEventListener('transitionend', tec)
  })

  card.classList.add('animating')
  card.classList.remove('animated')
  card.style.transform = card.style.webkitTransform = ''
}

function clearOriginalColumn(originalCard: HTMLElement, distance: number) {
  let travelNode = originalCard.previousElementSibling as HTMLElement

  while (travelNode) {
    if (travelNode.classList.contains('animated')) {
      clearCardTransform(travelNode)
    }

    travelNode = travelNode.previousElementSibling as HTMLElement
  }

  travelNode = originalCard.nextElementSibling as HTMLElement

  while (
    travelNode &&
    !travelNode.classList.contains('ghost') &&
    !travelNode.classList.contains('placeholder')
  ) {
    if (!travelNode.classList.contains('animated')) {
      transformCard(travelNode, -distance)
    }

    travelNode = travelNode.nextElementSibling as HTMLElement
  }
}

function clearColumn(column: HTMLElement) {
  column
    .querySelectorAll<HTMLElement>('.card.animated')
    .forEach((animatedCard) => {
      clearCardTransform(animatedCard)
    })
}

function transformCard(card: HTMLElement, distance: number): void {
  if (isAnimatedCard(card)) {
    return
  }

  card.addEventListener('transitionend', function tec() {
    card.classList.remove('animating')

    if (distance < 0) {
      card.classList.add('forwarded')
    }

    card.removeEventListener('transitionend', tec)
  })

  card.classList.add('animating')
  card.classList.add('animated')
  card.style.transform = card.style.webkitTransform = `translate3d(0, ${distance}px, 0)`
}

window.addEventListener('pointerdown', (e) => {
  if (document.querySelector('.card.new')) {
    return
  }

  const originalCard = (e.target as HTMLElement).closest<HTMLElement>('.card')

  if (!originalCard) {
    return
  }

  /** Picked a card */

  const initialX = e.pageX
  const initialY = e.pageY

  // Activated
  const longPressTimeOut = setTimeout(() => {
    // Disable text selection across the document
    document.body.style.userSelect = 'none'

    const originalColumn = originalCard.closest<HTMLElement>(
      '.column:not(.new)'
    )
    let previousColumn = originalColumn

    const originalCardStyle = window.getComputedStyle(originalCard)
    const originalCardRect = originalCard.getBoundingClientRect()

    const distance =
      originalCardRect.height +
      parseInt(originalCardStyle.marginTop) +
      parseInt(originalCardStyle.marginBottom)

    // Create a ghost card which is moving along the pointer
    const ghostCard = originalCard.cloneNode(true) as HTMLElement
    const placeholder = originalCard.cloneNode() as HTMLElement

    ghostCard.removeAttribute('data-card-id')
    placeholder.removeAttribute('data-card-id')

    // Initialize the ghost card and placeholder CSS properties and class name
    ghostCard.style.pointerEvents = placeholder.style.pointerEvents = 'none'
    ghostCard.style.position = 'fixed'
    ghostCard.style.width = placeholder.style.width = `${originalCard.clientWidth}px`
    ghostCard.style.height = placeholder.style.height = `${originalCard.clientHeight}px`

    // Style the placeholder
    placeholder.classList.add('placeholder')
    placeholder.style.position = 'absolute'
    placeholder.style.top = '0px'
    placeholder.style.transform = `translate3d(0, ${originalCard.offsetTop}px, 0)`

    // Prepend placeholder
    originalCard.parentElement.prepend(placeholder)

    const placeholderRect = placeholder.getBoundingClientRect()

    const originalCardLeft = placeholderRect.left
    const originalCardTop = placeholderRect.top

    // Style the ghost card
    ghostCard.classList.add('ghost')
    ghostCard.style.transition =
      'box-shadow 200ms ease, transform 200ms ease, opacity 200ms ease'
    ghostCard.style.top = `${placeholderRect.top}px`
    ghostCard.style.left = `${placeholderRect.left}px`
    ghostCard.style.zIndex = '9999'
    ghostCard.style.opacity = '0.9'

    // Insert into the DOM
    originalCard.parentElement.appendChild(ghostCard)

    // Trick for activating transitions
    ghostCard.getBoundingClientRect()

    ghostCard.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.4)'
    ghostCard.style.transform = ghostCard.style.webkitTransform = 'scale(1.05)'

    // Hide the original card
    originalCard.style.visibility = 'hidden'
    originalCard.classList.add('original')

    let originalCardIndex: number

    // Set data-card-index for all cards inside the same column
    originalCard.parentElement.querySelectorAll('.card').forEach((card, i) => {
      card.setAttribute('data-card-index', i.toString())

      if (card.isSameNode(originalCard)) {
        originalCardIndex = i
      }
    })

    let pmc: (e: PointerEvent) => void
    let dropTargetCard: HTMLElement = originalCard
    let currentColumn: HTMLElement = originalCard.closest<HTMLElement>(
      '.column:not(.new)'
    )
    let direction: 'forward' | 'backward' = 'forward'

    window.addEventListener(
      'pointermove',
      (pmc = (e) => {
        // Calculate the delta X, Y
        const deltaX = e.pageX - initialX
        const deltaY = e.pageY - initialY

        // Move the ghost card along with the mouse pointer position
        ghostCard.style.top = `${originalCardTop + deltaY}px`
        ghostCard.style.left = `${originalCardLeft + deltaX}px`

        // Memoize ghost card's bounding client rect
        const ghostCardRect = ghostCard.getBoundingClientRect()

        const ghostCardCenterX = ghostCardRect.left + ghostCardRect.width / 2
        const ghostCardCenterY = ghostCardRect.top + ghostCardRect.height / 2

        // Detect a card based on the coordinate of
        // the center of the ghost card
        const targetAtCenterOfGhostCard = document.elementFromPoint(
          ghostCardCenterX,
          ghostCardCenterY
        )
        const hoveredCard = targetAtCenterOfGhostCard?.closest<HTMLElement>(
          '.card'
        )

        const hoveredColumn = targetAtCenterOfGhostCard?.closest<HTMLElement>(
          '.column:not(.new)'
        )

        // Hover on the empty space of other columns
        const hoveredColumnRect = hoveredColumn?.getBoundingClientRect()

        if (hoveredColumn) {
          currentColumn = hoveredColumn
        }

        if (
          !hoveredCard &&
          hoveredColumn &&
          !hoveredColumn.contains(placeholder) &&
          ghostCardCenterX > hoveredColumnRect.left + 25 &&
          ghostCardCenterX < hoveredColumnRect.right - 25
        ) {
          let offsetTop = 68 // Column header height (64px) + padding top (4px)

          dropTargetCard = null

          const cards = hoveredColumn.querySelectorAll<HTMLElement>(
            '.card:not(.ghost):not(.placeholder):not(.original)'
          )

          cards.forEach((card) => {
            const style = window.getComputedStyle(card)
            offsetTop +=
              card.clientHeight +
              parseInt(style.marginTop) +
              parseInt(style.marginBottom)
          })

          placeholder.style.transform = `translate3d(0, ${offsetTop}px, 0)`
          hoveredColumn
            .querySelector<HTMLElement>('.cards-container')
            .prepend(placeholder)

          if (previousColumn.isSameNode(originalColumn)) {
            clearOriginalColumn(originalCard, distance)
          } else {
            // Clear all the transform of the animated cards
            // inside the previous column
            clearColumn(previousColumn)
          }

          previousColumn = hoveredColumn
        }

        // Ignore currently animating card
        if (!hoveredCard || hoveredCard.classList.contains('animating')) {
          return
        }

        dropTargetCard = hoveredCard

        if (!hoveredColumn.contains(placeholder)) {
          hoveredCard.parentElement.prepend(placeholder)
        }

        // Get hovered card's index (if it's inside the same column)
        // It will be `NaN` if the card belongs to other columns
        const hoveredCardIndex = parseInt(
          hoveredCard.getAttribute('data-card-index')
        )

        // Compare the hovered card's index and the original card's
        // only if both cards are inside the same column
        const isOnTheOriginalColumn = !isNaN(hoveredCardIndex)
        const hasIndexAndIsBigger = !isOnTheOriginalColumn
          ? null
          : originalCardIndex < hoveredCardIndex

        // Utility booleans
        const isAnimated = hoveredCard.classList.contains('animated')
        const isForwarded = hoveredCard.classList.contains('forwarded')
        const isBackwarded = isAnimated && !isForwarded

        // Determine the direction where the cards should go to
        direction = isForwarded
          ? 'backward'
          : hasIndexAndIsBigger !== null && hasIndexAndIsBigger
          ? 'forward'
          : isAnimated
          ? 'forward'
          : 'backward'

        // Set the placeholder's absolute top
        const placeholderY =
          hoveredCard.offsetTop +
          (isForwarded ? -distance : isBackwarded ? distance : 0) -
          (direction === 'forward'
            ? originalCard.clientHeight - hoveredCard.clientHeight
            : 0)

        // Reflow
        setTimeout(() => {
          placeholder.style.transform = `translate3d(0, ${placeholderY}px, 0)`
        }, 0)

        // Clear previous column's transform transition
        if (!previousColumn.isSameNode(hoveredColumn)) {
          // Different strategy for the original column and others

          if (previousColumn.isSameNode(originalColumn)) {
            clearOriginalColumn(originalCard, distance)
          } else {
            clearColumn(previousColumn)
          }
        }

        // Memoize the hovered column as the previous column
        previousColumn = hoveredColumn

        // Mutable node for walking through the node tree
        let travelNode = hoveredCard

        if (isAnimated) {
          while (isPureCard(travelNode)) {
            clearCardTransform(travelNode)

            travelNode = (isForwarded
              ? travelNode.nextElementSibling
              : travelNode.previousElementSibling) as HTMLElement
          }
        } else {
          while (
            isPureCard(travelNode) &&
            !travelNode.isSameNode(originalCard)
          ) {
            transformCard(travelNode, distance * (hasIndexAndIsBigger ? -1 : 1))

            travelNode = (hasIndexAndIsBigger
              ? travelNode.previousElementSibling
              : travelNode.nextElementSibling) as HTMLElement
          }
        }

        // Process additional jobs for further cards
        // when on the same column and end at the original card
        if (
          travelNode &&
          travelNode.isSameNode(originalCard) &&
          isOnTheOriginalColumn
        ) {
          travelNode = (direction === 'forward'
            ? travelNode.previousElementSibling
            : travelNode.nextElementSibling) as HTMLElement

          while (travelNode) {
            if (isAnimatedCard(travelNode)) {
              clearCardTransform(travelNode)
            }

            travelNode = (direction === 'forward'
              ? travelNode.previousElementSibling
              : travelNode.nextElementSibling) as HTMLElement
          }
        }
      })
    )

    // Pointer up at the and
    window.addEventListener('pointerup', function puc() {
      // Remove pointermove listener
      window.removeEventListener('pointermove', pmc)

      // Remove original class name from original card
      originalCard.classList.remove('original')

      // Allow user select of body
      document.body.style.userSelect = ''

      // Apply transition for returning
      ghostCard.style.transition = `top 200ms ease, left 200ms ease, box-shadow 200ms ease, transform 200ms ease, opacity 200ms ease`

      ghostCard.style.boxShadow = ''
      ghostCard.style.transform = ghostCard.style.webkitTransform = ''
      ghostCard.style.opacity = '1'

      const placeholderRect = placeholder.getBoundingClientRect()

      ghostCard.style.top = `${placeholderRect.top}px`
      ghostCard.style.left = `${placeholderRect.left}px`

      if (!originalCard.isSameNode(dropTargetCard)) {
        // Update the column ID
        const currentColumnId = parseInt(
          currentColumn.getAttribute('data-column-id')
        )

        const cardId = parseInt(originalCard.getAttribute('data-card-id'))
        const columnId = currentColumnId

        let previousCardId = null

        if (dropTargetCard) {
          const previousCard =
            direction === 'forward'
              ? dropTargetCard
              : dropTargetCard.previousElementSibling

          previousCardId =
            parseInt(previousCard.getAttribute('data-card-id')) || null
        } else {
          const allCards = currentColumn.querySelectorAll(
            '.card:not(.placeholder):not(.ghost)'
          )
          previousCardId =
            parseInt(
              allCards[allCards.length - 1]?.getAttribute('data-card-id')
            ) || null
        }
        const app = document.querySelector('.app')
        const boardId = parseInt(app.getAttribute('data-board-id')) || 1
        if (previousCardId !== cardId) {
          // Update card data using API
          modifyCardsOrderAPI({
            urlParam: {
              boardId,
            },
            bodyParam: {
              cardId,
              columnId,
              previousCardId,
            },
          })
        }
      }

      ghostCard.addEventListener('transitionend', function tec() {
        originalCard.removeAttribute('style')
        placeholder.remove()
        ghostCard.remove()

        // Update the DOM
        if (dropTargetCard) {
          dropTargetCard.parentElement.insertBefore(
            originalCard,
            direction === 'forward'
              ? dropTargetCard.nextElementSibling
              : dropTargetCard
          )
        } else {
          currentColumn
            .querySelector<HTMLElement>('.cards-container')
            .appendChild(originalCard)
        }

        // Clear all animated cards transform
        document
          .querySelectorAll<HTMLElement>('.card.animated')
          .forEach((animatedCard) => {
            animatedCard.style.transition = 'none'
            animatedCard.style.transform = ''
            animatedCard.classList.remove('animated')
            animatedCard.classList.remove('forwarded')
            animatedCard.getBoundingClientRect()
            animatedCard.removeAttribute('style')
          })

        // Remove data-card-index attribute
        originalColumn
          .querySelectorAll<HTMLElement>('.card')
          .forEach((card) => card.removeAttribute('data-card-index'))

        originalCard.removeAttribute('data-card-index')

        // Remove dummy cards
        document
          .querySelectorAll<HTMLElement>('.dummy-card')
          .forEach((dummy) => dummy.remove())

        // Update cards number
        updateColumnBadgeCount(originalColumn)
        updateColumnBadgeCount(currentColumn)

        ghostCard.removeEventListener('transitionend', tec)
      })

      // Remove pointerup listener
      window.removeEventListener('pointerup', puc)
    })
  }, 200)

  window.addEventListener('pointerup', function muc() {
    clearInterval(longPressTimeOut)

    window.removeEventListener('pointerup', muc)
  })

  window.addEventListener('pointermove', function pmc(e) {
    const absDeltaX = Math.abs(e.pageX - initialX)
    const absDeltaY = Math.abs(e.pageY - initialY)

    const absDistance = Math.sqrt(absDeltaX ** 2 + absDeltaY ** 2)

    if (absDistance > 3) {
      clearTimeout(longPressTimeOut)
      window.removeEventListener('pointermove', pmc)
    }
  })
})
