import { Column } from './column'
import { Card } from './card'

export type Activity = {
  id: number
  type: 'add' | 'delete' | 'modify' | 'move'
  boardId: number
  columnId: number
  cardId: number
  occurredAt: string
  from: string
  to: string
}
