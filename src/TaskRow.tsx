import type { Task } from './taskReducer'
import { FILTER_LABELS } from './labels'

type TaskRowProps = { task: Task; onNext: () => void; onDelete: () => void }

export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  return (
    <li className="task-row">
      <div className="task-title">
        <span className="task-indicator" data-status={task.status} aria-hidden="true" />
        <span>{task.title}</span>
      </div>
      <span className="status-badge" data-status={task.status}>{FILTER_LABELS[task.status]}</span>
      <div className="row-actions">
        <button
          type="button"
          className="next-button"
          aria-label={`Next for ${task.title}`}
          onClick={onNext}
        >
          Next <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className="delete-button"
          aria-label={`Delete ${task.title}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
