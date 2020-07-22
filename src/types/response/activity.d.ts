import { Column } from './column'
import { Card } from './card'

export type Activity = {
  id: number
  type: ActivityType
  boardId: number
  column: Column | null
  card: Card | null
  occurredAt: string
  from: string
  to: string
}

export type ActivityType = 'add' | 'delete' | 'modify' | 'move'
