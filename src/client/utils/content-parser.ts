export const parseContent = (content: string): [string, string] => {
  const firstNewLineIdx = content.indexOf('\n')

  if (firstNewLineIdx < 0) {
    return [content, '']
  }

  return [
    content.slice(0, firstNewLineIdx),
    content.slice(firstNewLineIdx + 1, content.length),
  ]
}

export const getCardTitle = (content) => {
  const [title] = parseContent(content)

  return title
}

export const parseBrackets = (content: string) => {
  const cardRegex = new RegExp('(<<)(.*?)(>>)', 'gm')
  const columnRegex = new RegExp('([[)(.*?)(]])', 'gm')

  content.replace(cardRegex, '<span class="content-card">$2</span>')
  content.replace(columnRegex, '<span class="content-column">$2</span>')

  return content
}
