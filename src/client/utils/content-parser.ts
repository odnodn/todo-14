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
  const cardRegex = /(<<)([\s\S]*?)(>>)/gm
  const columnRegex = /(\[\[)([\s\S]*?)(\]\])/gm

  let str = content.replace(cardRegex, '<span class="content-card">$2</span>')
  str = str.replace(columnRegex, '<span class="content-column">$2</span>')

  return str
}

export const parseLink = (content: string) => {
  const linkRegex = /(\[)(.*?)(\])(\()(.*?)(\))/gm

  const str = content.replace(
    linkRegex,
    '<a class="link" href="$5" target="_blank">$2</a>'
  )

  return str
}
