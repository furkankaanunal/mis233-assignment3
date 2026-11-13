import { useReducer } from 'react'
import { initialState, taskReducer, type Task, type Action } from './taskReducer'
import type { Dispatch } from 'react'
import { countByFilter, FILTERS, filterTasks, type Filter } from './filter'
import TaskRow from './TaskRow'
import { FILTER_LABELS } from './labels'
import './app.css'

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form className="add-form" action={addTask}>
      <label htmlFor="task-title">New task</label>
      <div className="add-form-controls">
        <input id="task-title" name="title" placeholder="What needs to be done?" required />
        <button type="submit" className="add-button">
          <span aria-hidden="true">+</span> Add
        </button>
      </div>
    </form>
  )
}

type FilterBarProps = {
  activeFilter: Filter
  counts: Record<Filter, number>
  dispatch: Dispatch<Action>
}

function FilterBar({ activeFilter, counts, dispatch }: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks by status">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className="filter-button"
          aria-pressed={activeFilter === filter}
          onClick={() => dispatch({ type: 'setFilter', filter })}
        >
          {FILTER_LABELS[filter]} <span className="filter-count">{counts[filter]}</span>
        </button>
      ))}
    </div>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) return <p className="empty-list">No tasks here.</p>

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onNext={() => dispatch({ type: 'advance', id: task.id })}
          onDelete={() => dispatch({ type: 'remove', id: task.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const counts = countByFilter(state.tasks)
  const visibleTasks = filterTasks(state.tasks, state.filter)
  const completion = counts.all === 0 ? 0 : Math.round((counts.done / counts.all) * 100)

  return (
    <main className="workspace">
      <header className="task-header">
        <div>
          <div className="title-row">
            <span className="task-mark" aria-hidden="true" />
            <h1>Task Manager</h1>
          </div>
          <AddForm dispatch={dispatch} />
        </div>
        <div className="completion">
          <div className="completion-label">
            <label htmlFor="task-completion">Completion</label>
            <span>{completion}%</span>
          </div>
          <progress id="task-completion" value={counts.done} max={counts.all || 1} />
          <p role="status">{counts.done} of {counts.all} completed</p>
        </div>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <div className="panel-heading">
          <h2 id="tasks-heading">Tasks</h2>
          <div className="task-actions">
            <button
              type="button"
              className="secondary-button"
              disabled={counts.done === 0}
              onClick={() => dispatch({ type: 'clearDone' })}
            >
              Clear done
            </button>
          </div>
        </div>
        <FilterBar activeFilter={state.filter} counts={counts} dispatch={dispatch} />
        <TaskList tasks={visibleTasks} dispatch={dispatch} />
      </section>
    </main>
  )
}
