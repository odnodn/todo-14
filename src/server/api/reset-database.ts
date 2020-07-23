import express from 'express'
import { query } from '../modules/query'

const router = express.Router()

router.delete(`/board/:boardId/reset`, async (req, res) => {
  await query(`
    SET foreign_key_checks = 0;
    DELETE FROM activity;
    DELETE FROM card;
    DELETE FROM \`column\`;
    SET foreign_key_checks = 1;
  `)

  res.sendStatus(200)
})

export { router as resetDatabaseRouter }
