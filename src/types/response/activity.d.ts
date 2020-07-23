import { Column } from './column'
import { Card } from './card'

export type Activity = {
  id: number
  type: ActivityType
  content: string
}

export type ActivityType = 'add' | 'delete' | 'modify' | 'move'
