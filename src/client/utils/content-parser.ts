export const parseContent = (content: string): [string, string] => {
  const firstNewLineIdx = content.indexOf('\n')

  if (firstNewLineIdx < 0) {
    return [content, '']
  }

  return [
    content.slice(0, firstNewLineIdx).trim(),
    content.slice(firstNewLineIdx + 1, content.length).trim(),
  ]
}

export const getCardTitle = (content) => {
  const [title] = parseContent(content)

  return title
}

export const parseBrackets = (content: string) => {
  const cardRegex = /(<<)(.*?)(>>)/gm
  const columnRegex = /(\[\[)(.*?)(\]\])/gm

  let str = content.replace(cardRegex, '<span class="content-card">$2</span>')
  str = str.replace(columnRegex, '<span class="content-column">$2</span>')

  return str
}
