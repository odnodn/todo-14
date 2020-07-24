import dayjs from 'dayjs'

export const friendlyTime = (time: Date | string): string => {
  if (!time) return ''

  let timeString = dayjs(time).add(9, 'hour').format('YYYY. MM. DD. HH:mm')

  const now = dayjs()
  const atObj = dayjs(time).add(9, 'hour')

  const secDiff = now.diff(atObj, 'second')
  if (secDiff < 10) {
    timeString = '방금'
    return timeString
  } else if (secDiff < 60) {
    timeString = `${secDiff}초 전`
    return timeString
  } else {
    const minDiff = now.diff(atObj, 'minute')
    if (minDiff > 0 && minDiff < 60) {
      timeString = `${minDiff}분 전`
      return timeString
    } else {
      const hourDiff = now.diff(atObj, 'hour')
      const dayDiff = now.diff(atObj, 'day')
      const monthDiff = now.diff(atObj, 'month')
      const yearDiff = now.diff(atObj, 'year')
      if (hourDiff > 0 && hourDiff < 24) {
        timeString = `${hourDiff}시간 전`
        return timeString
      } else if (now.day() !== atObj.day() && now.month() === atObj.month()) {
        timeString = `${dayDiff}일 전`
        return timeString
      } else if (now.month() !== atObj.month() && now.year() === atObj.year()) {
        timeString = `${monthDiff}달 전`
        return timeString
      } else if (now.year() !== atObj.year()) {
        timeString = `${yearDiff || 1}년 전`
        return timeString
      }
    }
  }

  return timeString
}
