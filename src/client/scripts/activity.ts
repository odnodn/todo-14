import { getActivitiesListAPI } from '../api/get-activities-list'
import { parseBrackets } from '../utils/content-parser'
import { generateActivity, generateElement } from './html-generator'
import { Activity, ActivityType } from '@/types/response'

window.addEventListener('DOMContentLoaded', () => {
  const activityBtn = document.querySelector<HTMLElement>('.activity-btn')
  const activityJumbo = document.querySelector<HTMLElement>('.activity-jumbo')
  const activityClose = document.querySelector<HTMLElement>('.activity-close')
  const activitySidebar = document.querySelector<HTMLElement>(
    '.activity-sidebar'
  )

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

  const renderActivities = (activities: Activity[]) => {
    activitySidebar.innerHTML = ''

    const activitiesContainerElm = generateElement(
      `<div class="activity-container"></div>`
    )

    activities.forEach((act) => {
      const iconName = getActivityIconsName(act.type)
      const content = parseBrackets(act.content)
      const actElm = generateActivity({
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
      urlParam: { boardId: 1 },
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
