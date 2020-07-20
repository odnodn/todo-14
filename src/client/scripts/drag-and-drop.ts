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
  const originalCard = (e.target as HTMLElement).closest<HTMLElement>('.card')

  if (!originalCard) {
    return
  }

  /** Picked a card */

  // Disable text selection across the document
  document.body.style.userSelect = 'none'

  const originalColumn = originalCard.closest<HTMLElement>('.column')
  let previousColumn = originalColumn

  const initialX = e.pageX
  const initialY = e.pageY

  const originalCardStyle = window.getComputedStyle(originalCard)
  const originalCardRect = originalCard.getBoundingClientRect()

  const distance =
    originalCardRect.height +
    parseInt(originalCardStyle.marginTop) +
    parseInt(originalCardStyle.marginBottom)

  // Create a ghost card which is moving along the pointer
  const ghostCard = originalCard.cloneNode(true) as HTMLElement
  const placeholder = originalCard.cloneNode() as HTMLElement

  // Initialize the ghost card and placeholder CSS properties and class name
  ghostCard.style.pointerEvents = placeholder.style.pointerEvents = 'none'
  ghostCard.style.position = 'fixed'
  ghostCard.style.width = placeholder.style.width = `${originalCardRect.width}px`
  ghostCard.style.height = placeholder.style.height = `${originalCardRect.height}px`

  // Style the ghost card
  ghostCard.classList.add('ghost')
  ghostCard.style.transition = 'box-shadow 200ms ease, transform 200ms ease'
  ghostCard.style.top = `${originalCardRect.top}px`
  ghostCard.style.left = `${originalCardRect.left}px`
  ghostCard.style.zIndex = '9999'
  ghostCard.style.opacity = '0.9'

  // Style the placeholder
  placeholder.classList.add('placeholder')
  placeholder.style.position = 'absolute'
  placeholder.style.top = '0px'
  placeholder.style.transform = `translate3d(0, ${originalCard.offsetTop}px, 0)`

  // Insert into the DOM
  originalCard.parentElement.appendChild(ghostCard)
  originalCard.parentElement.appendChild(placeholder)

  // Trick for activating transitions
  ghostCard.getBoundingClientRect()

  ghostCard.style.boxShadow = '0 22px 60px rgba(0, 0, 0, 0.3)'
  ghostCard.style.transform = ghostCard.style.webkitTransform = 'scale(1.05)'

  // Hide the original card
  originalCard.style.visibility = 'hidden'

  let originalCardIndex: number

  // Set data-card-index for all cards inside the same column
  originalCard.parentElement.querySelectorAll('.card').forEach((card, i) => {
    card.setAttribute('data-card-index', i.toString())

    if (card.isSameNode(originalCard)) {
      originalCardIndex = i
    }
  })

  let pmc: (e: PointerEvent) => void

  window.addEventListener(
    'pointermove',
    (pmc = (e) => {
      // Calculate the delta X, Y
      const deltaX = e.pageX - initialX
      const offsetY = e.pageY - initialY

      // Move the ghost card along with the mouse pointer position
      ghostCard.style.top = `${originalCardRect.top + offsetY}px`
      ghostCard.style.left = `${originalCardRect.left + deltaX}px`

      // Memoize ghost card's bounding client rect
      const ghostCardRect = ghostCard.getBoundingClientRect()

      // Detect a card based on the coordinate of
      // the center of the ghost card
      const hoveredCard = document
        .elementFromPoint(
          ghostCardRect.left + ghostCardRect.width / 2,
          ghostCardRect.top + ghostCardRect.height / 2
        )
        ?.closest('.card') as HTMLElement

      if (!hoveredCard || hoveredCard.classList.contains('animating')) {
        return
      }

      const hoveredCardRect = hoveredCard.getBoundingClientRect()

      const hoveredColumn = hoveredCard.closest('.column') as HTMLElement

      if (!hoveredColumn.contains(placeholder)) {
        hoveredCard.parentElement.appendChild(placeholder)
      }

      // Get hovered card's index (if it's inside the same column)
      // It will be `NaN` if the card belongs to other columns
      const hoveredCardIndex = parseInt(
        hoveredCard.getAttribute('data-card-index')
      )

      // Compare the hovered card's index and the original card's
      // only if both cards are inside the same column
      const isOnTheSameColumn = !isNaN(hoveredCardIndex)
      const hasIndexAndIsBigger = !isOnTheSameColumn
        ? null
        : originalCardIndex < hoveredCardIndex

      // Utility booleans
      const isAnimated = hoveredCard.classList.contains('animated')
      const isForwarded = hoveredCard.classList.contains('forwarded')
      const isBackwarded = isAnimated && !isForwarded

      // Determine the direction where the cards should go to
      const direction: 'forward' | 'backward' = isForwarded
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

      if (!hoveredColumn.isSameNode(originalColumn)) {
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
      } else if (!previousColumn.isSameNode(hoveredColumn)) {
        previousColumn
          .querySelectorAll<HTMLElement>('.card.animated')
          .forEach((animatedCard) => {
            clearCardTransform(animatedCard)
          })
      }

      previousColumn = hoveredColumn

      let travelNode = hoveredCard

      if (isAnimated) {
        while (isPureCard(travelNode)) {
          clearCardTransform(travelNode)

          travelNode = (isForwarded
            ? travelNode.nextElementSibling
            : travelNode.previousElementSibling) as HTMLElement
        }
      } else {
        while (isPureCard(travelNode) && !travelNode.isSameNode(originalCard)) {
          // console.log(travelNode)
          transformCard(travelNode, distance * (hasIndexAndIsBigger ? -1 : 1))

          travelNode = (hasIndexAndIsBigger
            ? travelNode.previousElementSibling
            : travelNode.nextElementSibling) as HTMLElement
        }
      }

      // Loop through previous or next cards
      // while (
      //   (isAnimated &&
      //     travelNode &&
      //     travelNode.classList.contains('animated')) ||
      //   (!isAnimated &&
      //     travelNode &&
      //     !travelNode.isSameNode(originalCard) &&
      //     !travelNode.classList.contains('animated'))
      // ) {
      //   if (isAnimated) {
      //     clearCardTransform(travelNode)

      //     travelNode = (isForwarded
      //       ? travelNode.nextElementSibling
      //       : travelNode.previousElementSibling) as HTMLElement
      //   } else {
      //     transformCard(travelNode, distance * (hasIndexAndIsBigger ? -1 : 1))

      //     travelNode = (hasIndexAndIsBigger
      //       ? travelNode.previousElementSibling
      //       : travelNode.nextElementSibling) as HTMLElement
      //   }
      // }

      // Process additional jobs for further cards
      // when on the same column and end at the original card
      if (
        travelNode &&
        travelNode.isSameNode(originalCard) &&
        isOnTheSameColumn
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

    // Allow user select of body
    document.body.style.userSelect = ''

    // Apply transition for returning
    ghostCard.style.transition = `top 200ms ease, left 200ms ease, box-shadow 200ms ease, transform 200ms ease`

    ghostCard.style.boxShadow = 'none'
    ghostCard.style.transform = ghostCard.style.webkitTransform = ''

    const placeholderRect = placeholder.getBoundingClientRect()

    ghostCard.style.top = `${placeholderRect.top}px`
    ghostCard.style.left = `${placeholderRect.left}px`

    ghostCard.addEventListener('transitionend', function tec() {
      ghostCard.parentElement.removeChild(ghostCard)

      ghostCard.removeEventListener('transitionend', tec)
    })

    // Remove pointerup listener
    window.removeEventListener('pointerup', puc)
  })
})
