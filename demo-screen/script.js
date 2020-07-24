/** @type {HTMLDivElement} */
const introBlockContainer = document.querySelector('.intro-block-container')
introBlockContainer.classList.add('animate')

const blocks = document.querySelectorAll('.block')
/** @type {HTMLDivElement} */
const textContainer = document.querySelector('.text-container')
/** @type {HTMLDivElement} */
const videoWrapper = document.querySelector('.video-wrapper')
/** @type {HTMLVideoElement} */
const video = videoWrapper.querySelector('.video')
const videoSource = video.querySelector('source')

const showText = () => textContainer.classList.add('show')
const hideText = () => textContainer.classList.remove('show')

const showVideo = () => videoWrapper.classList.remove('hidden')
const hideVideo = () => videoWrapper.classList.add('hidden')

const updateText = (textArr) => {
  let html = ''

  textArr.forEach((text) => {
    html += `
      <p class="${text.startsWith(' ') ? 'title' : 'body'} text-wrapper">
        <span class="text">${text.trim()}</span>
      </p>
    `
  })

  textContainer.innerHTML = html

  textContainer.getBoundingClientRect()

  showText()
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  blocks[blocks.length - 1].addEventListener('animationstart', async () => {
    await wait(1700)
    showText()
    await wait(3000)
    hideText()
    setTimeout(() => {
      introBlockContainer.style.opacity = '0'
    }, 300)
    await wait(1000)
    updateText([
      ' Create a Card',
      'by just pressing plus button',
      'at top right corner',
    ])
    await wait(600)
    showVideo()
    await wait(1000)
    video.play()
    video.onended = () => {
      modifyCard()
    }
  })
}

async function modifyCard() {
  hideText()
  await wait(1000)
  hideVideo()
  await wait(700)
  videoSource.setAttribute('src', './videos/modify-a-card.mov')
  video.load()
  updateText([' Double click', ' to edit card'])
  await wait(500)
  showVideo()
  await wait(1000)
  video.play()
  video.onended = () => {
    dndCard()
  }
}

async function dndCard() {
  hideText()
  await wait(1000)
  hideVideo()
  await wait(700)
  videoWrapper.style.right = '42vw'
  videoWrapper.style.width = '50vw'
  textContainer.style.left = '62vw'
  textContainer.style.width = '30vw'
  videoSource.setAttribute('src', './videos/dnd-card.mov')
  video.load()
  updateText([' Drag', ' and', ' Drop', ' Cards to', ' anywhere'])
  await wait(1000)
  showVideo()
  await wait(1000)
  video.play()
  video.onended = () => {
    modifyColumn()
  }
}

async function modifyColumn() {
  hideText()
  await wait(1000)
  hideVideo()
  await wait(1200)
  videoWrapper.removeAttribute('style')
  textContainer.removeAttribute('style')

  videoWrapper.style.left = '50vw'
  videoWrapper.style.top = ''
  videoWrapper.style.bottom = '0'
  videoWrapper.style.width = '100vw'
  videoWrapper.style.height = '70vw'
  videoWrapper.style.transform = 'translateX(-50%) translateY(-5%)'
  videoWrapper.style.transition = 'opacity 800ms ease'

  textContainer.style.top = 'unset'
  textContainer.style.bottom = '60vh'
  textContainer.style.left = '50vw'
  textContainer.style.transform = 'translateX(-50%)'
  textContainer.style.width = '100vw'

  videoSource.setAttribute('src', './videos/modify-a-column.mov')
  video.load()
  updateText([' Double click', ' to edit column name'])
  textContainer.querySelectorAll('.text-wrapper').forEach((wrapper) => {
    wrapper.style.width = '100%'
    wrapper.style.textAlign = 'center'
    wrapper.querySelector('.text').style.textAlign = 'center'
  })
  await wait(300)
  showVideo()
  await wait(1500)
  video.play()
  video.onended = () => {
    dndColumn()
  }
}

async function dndColumn() {
  hideText()
  await wait(1200)
  hideVideo()
  await wait(1200)

  videoWrapper.removeAttribute('style')
  textContainer.removeAttribute('style')

  videoWrapper.style.right = '42vw'
  videoWrapper.style.width = '50vw'

  textContainer.style.left = '62vw'
  textContainer.style.width = '30vw'

  videoSource.setAttribute('src', './videos/dnd-column.mov')
  video.load()
  updateText([' Drag', ' and', ' Drop', ' Columns', ' as well'])
  await wait(300)
  showVideo()
  await wait(1500)
  video.play()
  video.onended = () => {
    mobile()
  }
}

async function mobile() {
  hideText()
  await wait(1000)
  hideVideo()
  await wait(700)
  videoWrapper.removeAttribute('style')
  videoWrapper.style.borderRadius = '15'
  textContainer.removeAttribute('style')
  videoSource.setAttribute('src', './videos/mobile.mov')
  video.load()
  updateText([' Mobile Support', ' (WIP)', 'Horizontal and scroll mode'])
  await wait(500)
  showVideo()
  await wait(1000)
  video.play()
  video.onended = () => {
    videoSource.setAttribute('src', './videos/mobile-scroll.mov')
    video.load()
    video.play()
    video.onended = () => {
      darkMode()
    }
  }
}

async function darkMode() {
  hideText()
  await wait(1000)
  hideVideo()

  await wait(800)

  videoWrapper.removeAttribute('style')
  textContainer.removeAttribute('style')
  document.body.style.backgroundColor = '#000'

  updateText([' Dark Mode', 'Ease on your eyes'])

  document.querySelector('.moon').style.transform =
    'translateY(-50%) translateX(-50%)'

  setTimeout(() => {
    document.body.style.opacity = '0'
    document.body.style.backgroundColor = ''

    setTimeout(() => {
      window.location.reload()
    }, 800)
  }, 6000)
}

run()
