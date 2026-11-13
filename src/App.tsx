import { useReducer } from 'react'
import { initialState, taskReducer, type Task, type Action } from './taskReducer'
import TaskRow from './TaskRow'
import type { Dispatch } from 'react'

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  return (
    <main>
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />
      <TaskList tasks={state.tasks} dispatch={dispatch} />
    </main>
  )
}
