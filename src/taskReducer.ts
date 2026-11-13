export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

export function taskReducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'add':
      return [...tasks, { id: action.id, title: action.title, status: 'todo' }]
    case 'advance':
      return tasks.map((t) =>
        t.id === action.id ? { ...t, status: NEXT[t.status] } : t,
      )
    case 'remove':
      return tasks.filter((t) => t.id !== action.id)
  }
}
