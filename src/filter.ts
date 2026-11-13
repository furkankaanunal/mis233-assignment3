// Requirement R4: write these two pure functions. No React in this file.
import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status

export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

/** Return the tasks to show for the chosen filter. 'all' returns every task. */
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  void filter // remove this line when you use the parameter
  return tasks
}

/** Return how many tasks each filter button would show, for example { all: 3, todo: 1, ... }. */
export function countByFilter(tasks: Task[]): Record<Filter, number> {
  void tasks // remove this line when you use the parameter
  return { all: 0, todo: 0, 'in-progress': 0, done: 0 }
}
