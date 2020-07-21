const activityBtn = document.querySelector<HTMLElement>('.activity-btn')
const activityJumbo = document.querySelector<HTMLElement>('.activity-jumbo')
const activityClose = document.querySelector<HTMLElement>('.activity-close')

activityClose.addEventListener('click', function cc() {
  activityJumbo.classList.add('hidden')
})

activityBtn.addEventListener('click', () => {
  activityJumbo.classList.remove('hidden')
})

window.addEventListener('click', function cc(e) {
  const target = e.target

  if (!(target instanceof HTMLElement)) {
    return
  }

  if (!target.closest('.activity-jumbo') && !target.closest('.activity-btn')) {
    console.log('here')
    activityJumbo.classList.add('hidden')
  }
})
