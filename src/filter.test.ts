import { describe, expect, it } from 'vitest'
import { countByFilter, filterTasks, FILTERS } from './filter'
import { taskReducer, type State, type Task } from './taskReducer'

const tasks: Task[] = [
  { id: 'a', title: 'Write notes', status: 'todo' },
  { id: 'b', title: 'Run tests', status: 'in-progress' },
  { id: 'c', title: 'Read the assignment', status: 'done' },
  { id: 'd', title: 'Check the build', status: 'todo' },
]

describe('filterTasks', () => {
  it('returns the full list for All', () => {
    expect(filterTasks(tasks, 'all')).toBe(tasks)
  })

  it('shows only todo tasks and preserves their order', () => {
    expect(filterTasks(tasks, 'todo')).toEqual([tasks[0], tasks[3]])
  })

  it('shows only in-progress tasks', () => {
    expect(filterTasks(tasks, 'in-progress')).toEqual([tasks[1]])
  })

  it('shows only done tasks', () => {
    expect(filterTasks(tasks, 'done')).toEqual([tasks[2]])
  })

  it('returns an empty list when there is no match', () => {
    expect(filterTasks([tasks[0]], 'done')).toEqual([])
  })

  it.each(FILTERS)('returns no tasks for the %s filter on an empty list', (filter) => {
    expect(filterTasks([], filter)).toEqual([])
  })
})

describe('countByFilter', () => {
  it('counts the full list and each status', () => {
    expect(countByFilter(tasks)).toEqual({ all: 4, todo: 2, 'in-progress': 1, done: 1 })
  })

  it('returns zero for every filter on an empty list', () => {
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })

  it('recalculates counts from the remaining tasks after a delete', () => {
    const state: State = { tasks, filter: 'in-progress', past: [] }
    const next = taskReducer(state, { type: 'remove', id: 'b' })

    expect(countByFilter(next.tasks)).toEqual({ all: 3, todo: 2, 'in-progress': 0, done: 1 })
    expect(filterTasks(next.tasks, next.filter)).toEqual([])
  })
})
