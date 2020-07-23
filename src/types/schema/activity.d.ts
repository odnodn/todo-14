import { ActivityType } from '../response'

export type Activity = {
  id?: number
  type?: ActivityType
  content?: string
}
