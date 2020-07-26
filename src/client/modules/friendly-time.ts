import dayjs from 'dayjs'

export const friendlyTime = (time: Date | string): string => {
  if (!time) return ''

  let timeString = dayjs(time).add(9, 'hour').format('YYYY. MM. DD. HH:mm')

  const now = dayjs()
  const atObj = dayjs(time).add(9, 'hour')

  const minDiff = now.diff(atObj, 'minute')
  const dayDiff = now.diff(atObj, 'day')
  const monthDiff = now.diff(atObj, 'month')
  const yearDiff = now.diff(atObj, 'year')

  if (yearDiff >= 1) {
    timeString = `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`
  } else if (monthDiff >= 1) {
    timeString = `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`
  } else if (dayDiff >= 1) {
    timeString = `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`
  } else if (minDiff >= 1) {
    timeString = `${minDiff} min${minDiff > 1 ? 's' : ''} ago`
  } else {
    timeString = `now`
  }

  return timeString
}
