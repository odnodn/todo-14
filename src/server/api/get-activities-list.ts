import express from 'express'

import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'

import { Activity } from '@/types/response'

const router = express.Router()

export type GetActivitiesListRequestParams = {
  boardId: number
}

export type GetActivitiesListResponseData = {
  activities: Activity[]
}

router.get('/board/:boardId/activity', async (req, res) => {
  const { boardId } = (req.params as unknown) as GetActivitiesListRequestParams
  const { lastSendedActivityId } = req.body

  if (!boardId) {
    res.sendStatus(400)
    return
  }

  const additionalOption = lastSendedActivityId
    ? `AND id < ${escape(lastSendedActivityId)}`
    : ''

  // SELECT * FROM activity WHERE boardId=1 AND id < 40 ORDER BY id DESC LIMIT 10
  const activities = await query<Activity[]>(
    `SELECT * FROM activity WHERE boardId=${escape(
      boardId
    )} ${additionalOption} ORDER BY id DESC LIMIT 20`
  )

  const responseData: GetActivitiesListResponseData = { activities }

  res.json(responseData)
})

export { router as getActivitiesListRouter }
