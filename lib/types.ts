export interface Task {
  id: string
  name: string
  description?: string
  updated: {
    date: string
    time: string
  }
  status: 'Planing' | 'In Progress' | 'Done'
}
