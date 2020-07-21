import { generateColumn } from './html-generator'
import { getElementIds } from './get-data-id'

async function modifyColumn({
  boardId,
  columnId,
  data,
}: {
  boardId: number
  columnId: number
  data: {
    name: string
    previousColumnId: number
  }
}) {
  const res = await fetch(`/board/${boardId}/column/${columnId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return res.ok
}

function onClickNewColumnBtn(newColumnBtn: HTMLElement) {
  const newColumnElm = generateColumn({ id: 0, name: 'untitled column' })

  newColumnElm.className = 'column'

  const columnNameElm = newColumnElm.querySelector(
    '.column-name'
  ) as HTMLHeadingElement

  const columns = document.querySelectorAll('.column:not(.new)')
  const lastColumn = columns[columns.length - 1]

  const boardId = parseInt(
    document.querySelector('.app').getAttribute('data-board-id')
  )
  const previousColumnId =
    columns.length === 0
      ? null
      : parseInt(lastColumn.getAttribute('data-column-id'))

  fetch(`/board/${boardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: columnNameElm.textContent,
      previousColumnId,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        alert('API Error')
        newColumnElm.parentElement.removeChild(newColumnElm)

        return { column: null }
      }

      return res.json()
    })
    .then((data) => {
      const column = data.column

      if (!column) {
        return
      }

      newColumnElm.setAttribute('data-column-id', column.id)
      // Insert the new column element
      newColumnBtn.parentElement.insertBefore(newColumnElm, newColumnBtn)
      columnNameElm.contentEditable = 'true'
      const columnNameRange = document.createRange()
      columnNameRange.setStartBefore(columnNameElm.firstChild)
      columnNameRange.setEndAfter(columnNameElm.firstChild)

      const sel = window.getSelection()

      sel.removeAllRanges()
      sel.addRange(columnNameRange)
    })

  columnNameElm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      columnNameElm.removeAttribute('contenteditable')
    }
  })

  columnNameElm.addEventListener('blur', async function bc() {
    columnNameElm.removeAttribute('contenteditable')
    window.getSelection().removeAllRanges()

    await modifyColumn({
      boardId,
      columnId: parseInt(newColumnElm.getAttribute('data-column-id')),
      data: {
        name: columnNameElm.textContent,
        previousColumnId,
      },
    })

    columnNameElm.removeEventListener('blur', bc)
  })
}

// Remove a column

async function removeColumnHandler(columnElm: HTMLElement) {
  // TODO: use current board id
  const boardId = 1
  const columnId = parseInt(columnElm.getAttribute('data-column-id'))

  const nextSibling = columnElm.nextElementSibling
  const parentElement = columnElm.parentElement

  const res = await fetch(`/board/${boardId}/column/${columnId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    // Restore the column if removal fails
    parentElement.insertBefore(columnElm, nextSibling)

    return
  }

  parentElement.removeChild(columnElm)
}

window.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement

  const deleteColumnBtn = target.closest<HTMLDivElement>(
    '.action-btn.delete-column-btn'
  )
  const newColumnBtn = target.closest<HTMLDivElement>('.column.new')

  if (deleteColumnBtn) {
    const columnElm = deleteColumnBtn.closest('.column') as HTMLElement

    removeColumnHandler(columnElm)
  } else if (newColumnBtn) {
    onClickNewColumnBtn(newColumnBtn)
  }
})

window.addEventListener('dblclick', (e) => {
  const target = e.target as HTMLElement

  const columnNameElm = target.closest<HTMLDivElement>('.column-name')

  if (!columnNameElm) {
    return
  }

  columnNameElm.contentEditable = 'true'

  const originalName = columnNameElm.textContent

  const sel = window.getSelection()
  const range = document.createRange()
  range.setStart(columnNameElm.firstChild, 0)
  range.setEnd(columnNameElm.firstChild, originalName.length)
  sel.removeAllRanges()
  sel.addRange(range)

  columnNameElm.addEventListener('blur', async function bc() {
    columnNameElm.removeEventListener('blur', bc)

    columnNameElm.removeAttribute('contenteditable')

    const newName = columnNameElm.textContent.trim()

    if (newName === originalName) {
      columnNameElm.innerHTML = newName
      return
    }

    const columnElm = columnNameElm.closest('.column') as HTMLElement
    const [boardId, columnId] = getElementIds(columnNameElm)

    await modifyColumn({
      boardId,
      columnId,
      data: {
        name: columnNameElm.textContent,
        previousColumnId:
          parseInt(
            columnElm.previousElementSibling?.getAttribute('data-column-id')
          ) || null,
      },
    })
  })

  columnNameElm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      columnNameElm.blur()
    } else if (e.key === 'Escape') {
      columnNameElm.innerHTML = originalName
      columnNameElm.blur()
    }
  })
})
