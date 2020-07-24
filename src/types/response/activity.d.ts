export type Activity = {
  id: number
  type: ActivityType
  content: string
  createdAt: string
}

export type ActivityType = 'add' | 'delete' | 'modify' | 'move'
