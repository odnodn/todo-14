import express from 'express'
import { query } from '../modules/query'
import { resetSql } from './sql/reset'

const router = express.Router()

router.delete(`/board/:boardId/reset`, async (req, res) => {
  await query(resetSql)

  res.sendStatus(200)
})

export { router as resetDatabaseRouter }
