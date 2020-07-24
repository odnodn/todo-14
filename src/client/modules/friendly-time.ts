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
      if (hourDiff > 0 && hourDiff < 24) {
        timeString = `${hourDiff}시간 전`
        return timeString
      } else if (now.year() === atObj.year()) {
        return dayjs(time).format('MM/DD HH:mm')
      }
    }
  }

  return timeString
}
