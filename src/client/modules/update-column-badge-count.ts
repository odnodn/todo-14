export const updateColumnBadgeCount = (columnElm: HTMLElement) => {
  columnElm.querySelector('.badge').innerHTML = columnElm
    .querySelectorAll('.card')
    .length.toString()
}

export const updateAllColumnsBadgeCount = () => {
  document
    .querySelectorAll<HTMLElement>('.column:not(.new)')
    .forEach((column) => updateColumnBadgeCount(column))
}
