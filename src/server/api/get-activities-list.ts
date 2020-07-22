import express from 'express'

import { query } from '@/server/modules/query'
import { escape } from '@/server/modules/escape'

import { Activity as ActivityResponse } from '@/types/response'

const router = express.Router()

export type GetActivitiesListRequestParams = {
  boardId: number
}

export type GetActivitiesListResponseData = {
  activities: ActivityResponse[]
}

router.get('/board/:boardId/activity', async (req, res) => {
  const { boardId } = (req.params as unknown) as GetActivitiesListRequestParams
  // 가져올 컬럼을 여기서 셋팅하면 generic type은 어떻게...?
  const activities = await query<ActivityResponse[]>(
    `SELECT * FROM activity WHERE boardId=${escape(boardId)}`
  )

  const result: GetActivitiesListResponseData = { activities }

  res.json(result)
})

export { router as getActivitiesListRouter }
