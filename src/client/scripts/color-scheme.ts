window.addEventListener('DOMContentLoaded', () => {
  const isDarkMode = localStorage.getItem('color-scheme') === 'dark-mode'

  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode')
  }

  document
    .querySelector<HTMLButtonElement>('.color-scheme')
    ?.addEventListener('click', () => {
      if (document.documentElement.classList.toggle('dark-mode')) {
        localStorage.setItem('color-scheme', 'dark-mode')
      } else {
        localStorage.removeItem('color-scheme')
      }
    })
})
