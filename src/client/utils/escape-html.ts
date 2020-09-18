export const escapeHtml = (str: string) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return str.replace(/[&<>"']/g, (m) => map[m])
}
