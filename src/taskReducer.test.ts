import { describe, expect, it } from 'vitest'
import { initialState, taskReducer, type State, type Task } from './taskReducer'

function exampleState(): State {
  return {
    filter: 'all',
    past: [],
    tasks: [
      { id: 'a', title: 'Read the brief', status: 'todo' },
      { id: 'b', title: 'Run the tests', status: 'in-progress' },
      { id: 'c', title: 'Set up the project', status: 'done' },
      { id: 'd', title: 'Create a Git repo', status: 'done' },
    ],
  }
}

describe('taskReducer', () => {
  it('starts empty with the All filter and no history', () => {
    expect(initialState).toEqual({ tasks: [], filter: 'all', past: [] })
  })

  it('adds a todo task using the supplied ID and title', () => {
    const state = { ...exampleState(), filter: 'done' } satisfies State
    const next = taskReducer(state, { type: 'add', id: 'e', title: 'Review screenshots' })

    expect(next.tasks).toEqual([
      ...state.tasks,
      { id: 'e', title: 'Review screenshots', status: 'todo' },
    ])
    expect(next.filter).toBe('done')
    expect(next.past).toEqual([state.tasks])
  })

  it('advances only the task with the matching ID', () => {
    const state = exampleState()
    const next = taskReducer(state, { type: 'advance', id: 'a' })

    expect(next.tasks[0]).toEqual({ ...state.tasks[0], status: 'in-progress' })
    expect(next.tasks[0]).not.toBe(state.tasks[0])
    expect(next.tasks[1]).toBe(state.tasks[1])
    expect(next.past[0]).toBe(state.tasks)
  })

  it('cycles from todo to in-progress to done and back to todo', () => {
    const state = exampleState()
    const action = { type: 'advance', id: 'a' } as const
    const inProgress = taskReducer(state, action)
    const done = taskReducer(inProgress, action)
    const todo = taskReducer(done, action)

    expect(inProgress.tasks[0].status).toBe('in-progress')
    expect(done.tasks[0].status).toBe('done')
    expect(todo.tasks[0].status).toBe('todo')
    expect(todo.past).toHaveLength(3)
  })

  it('removes the matching task and keeps the order of the other tasks', () => {
    const state = exampleState()
    const next = taskReducer(state, { type: 'remove', id: 'b' })

    expect(next.tasks.map((task) => task.id)).toEqual(['a', 'c', 'd'])
    expect(next.past[0]).toBe(state.tasks)
  })

  it('changes the filter while reusing the task list and undo history', () => {
    const state = exampleState()
    const next = taskReducer(state, { type: 'setFilter', filter: 'done' })

    expect(next.filter).toBe('done')
    expect(next.tasks).toBe(state.tasks)
    expect(next.past).toBe(state.past)
  })

  it('returns the same state when the selected filter is already active', () => {
    const state = exampleState()
    expect(taskReducer(state, { type: 'setFilter', filter: 'all' })).toBe(state)
  })

  it('clears every done task across the whole list and keeps the selected filter', () => {
    const state = { ...exampleState(), filter: 'todo' } satisfies State
    const next = taskReducer(state, { type: 'clearDone' })

    expect(next.tasks).toEqual(state.tasks.slice(0, 2))
    expect(next.filter).toBe('todo')
    expect(next.past).toEqual([state.tasks])
  })

  it.each(['advance', 'remove'] as const)('ignores %s for an unknown ID', (type) => {
    const state = exampleState()
    expect(taskReducer(state, { type, id: 'missing' })).toBe(state)
  })

  it('keeps the same state when there are no completed tasks to clear', () => {
    const state = exampleState()
    const cleared = taskReducer(state, { type: 'clearDone' })

    expect(taskReducer(cleared, { type: 'clearDone' })).toBe(cleared)
    expect(taskReducer(initialState, { type: 'clearDone' })).toBe(initialState)
  })

  it('does nothing when the undo history is empty', () => {
    expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState)
  })

  it('restores all cleared tasks and keeps the current filter after undo', () => {
    const state = exampleState()
    const cleared = taskReducer(state, { type: 'clearDone' })
    const filtered = taskReducer(cleared, { type: 'setFilter', filter: 'done' })
    const restored = taskReducer(filtered, { type: 'undo' })

    expect(restored.tasks).toBe(state.tasks)
    expect(restored.filter).toBe('done')
    expect(restored.past).toEqual([])
  })

  it('undoes a delete, an advance and an add in reverse order', () => {
    const added = taskReducer(initialState, { type: 'add', id: 'a', title: 'Review' })
    const advanced = taskReducer(added, { type: 'advance', id: 'a' })
    const removed = taskReducer(advanced, { type: 'remove', id: 'a' })
    const undoDelete = taskReducer(removed, { type: 'undo' })
    const undoAdvance = taskReducer(undoDelete, { type: 'undo' })
    const undoAdd = taskReducer(undoAdvance, { type: 'undo' })

    expect(undoDelete).toEqual(advanced)
    expect(undoAdvance).toEqual(added)
    expect(undoAdd).toEqual(initialState)
  })

  it('records a new change correctly after undo', () => {
    const state = exampleState()
    const advanced = taskReducer(state, { type: 'advance', id: 'a' })
    const undone = taskReducer(advanced, { type: 'undo' })
    const removed = taskReducer(undone, { type: 'remove', id: 'a' })

    expect(removed.past).toEqual([state.tasks])
    expect(taskReducer(removed, { type: 'undo' })).toEqual(state)
  })

  it('keeps the old state, task objects and history immutable', () => {
    const state = exampleState()
    const pastTasks: Task[] = [{ id: 'a', title: 'Read the brief', status: 'todo' }]
    state.past = [pastTasks]
    const before = structuredClone(state)
    for (const tasks of [state.tasks, pastTasks]) {
      for (const task of tasks) Object.freeze(task)
      Object.freeze(tasks)
    }
    Object.freeze(state.past)
    Object.freeze(state)

    const action = { type: 'advance', id: 'a' } as const
    const next = taskReducer(state, action)
    const undone = taskReducer(next, { type: 'undo' })

    expect(state).toEqual(before)
    expect(next.tasks).not.toBe(state.tasks)
    expect(next.past).not.toBe(state.past)
    expect(next.past).toEqual([pastTasks, before.tasks])
    expect(undone).toEqual(before)
    expect(taskReducer(state, action)).toEqual(next)
  })
})
