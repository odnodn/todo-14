import { ActivityType } from '../response'

export type Activity = {
  id?: number
  type?: ActivityType
  boardId?: number
  columnId?: number
  cardId?: number
  occurredAt?: string
  from?: string
  to?: string
}
