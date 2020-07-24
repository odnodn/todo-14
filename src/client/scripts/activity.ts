import { getActivitiesListAPI } from '../api/get-activities-list'
import { parseBrackets, parseLink } from '../utils/content-parser'
import { generateActivity, generateElement } from './html-generator'
import { Activity, ActivityType } from '@/types/response'

window.addEventListener('DOMContentLoaded', () => {
  const activityBtn = document.querySelector<HTMLElement>('.activity-btn')
  const activityJumbo = document.querySelector<HTMLElement>('.activity-jumbo')
  const activityClose = document.querySelector<HTMLElement>('.activity-close')
  const activitySidebar = document.querySelector<HTMLElement>(
    '.activity-sidebar'
  )

  let isFetching = false
  activitySidebar.addEventListener('scroll', async function temp(e) {
    // const target = e.target as HTMLElement
    const { scrollHeight, clientHeight, scrollTop } = activitySidebar

    const FIRE_HEIGHT = 50

    if (!isFetching && scrollHeight - clientHeight < scrollTop + FIRE_HEIGHT) {
      isFetching = true
      const lastId =
        parseInt(
          activitySidebar
            .querySelector('.activity-container')
            .lastElementChild?.getAttribute('data-act-id')
        ) || 0

      const activities = await getActivitiesListAPI({
        urlParam: { boardId: 1, lastSendedActivityId: lastId },
      })

      if (!activities.length) {
        activitySidebar.removeEventListener('scroll', temp)
        return
      }

      appendActivities(activities)

      isFetching = false
    }
  })

  const getActivityIconsName = (type: ActivityType): string => {
    switch (type) {
      case 'add':
        return 'plus_circle_fill'
      case 'delete':
        return 'minus_circle_fill'
      case 'modify':
        return 'pencil_circle_fill'
      case 'move':
        return 'arrow_right_arrow_left_circle_fill'
    }
  }

  const appendActivities = (activities: Activity[]) => {
    const fragmentElm = document.createDocumentFragment()

    activities.forEach((act) => {
      const iconName = getActivityIconsName(act.type)
      let content = parseBrackets(act.content)
      content = parseLink(content)
      const actElm = generateActivity({
        id: act.id,
        iconName,
        content,
        time: act.createdAt,
      })

      fragmentElm.appendChild(actElm)
    })

    const activitiesContainerElm = document.querySelector('.activity-container')
    activitiesContainerElm.appendChild(fragmentElm)
  }

  const renderActivities = (activities: Activity[]) => {
    activitySidebar.innerHTML = ''

    const activitiesContainerElm = generateElement(
      `<div class="activity-container"></div>`
    )

    activities.forEach((act) => {
      const iconName = getActivityIconsName(act.type)
      let content = parseBrackets(act.content)
      content = parseLink(content)
      const actElm = generateActivity({
        id: act.id,
        iconName,
        content,
        time: act.createdAt,
      })

      activitiesContainerElm.appendChild(actElm)
    })

    activitySidebar.appendChild(activitiesContainerElm)
  }

  activityClose.addEventListener('click', function cc() {
    activityJumbo.classList.add('hidden')
  })

  activityBtn.addEventListener('click', async () => {
    const activities = await getActivitiesListAPI({
      urlParam: { boardId: 1, lastSendedActivityId: 0 },
    })

    renderActivities(activities)

    activityJumbo.classList.remove('hidden')
  })

  window.addEventListener('click', function cc(e) {
    const target = e.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    if (
      !target.closest('.activity-jumbo') &&
      !target.closest('.activity-btn')
    ) {
      activityJumbo.classList.add('hidden')
    }
  })
})
