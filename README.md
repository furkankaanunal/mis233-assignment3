# Assignment 3 — Task Manager with a Reducer

**Furkan Kaan Ünal**

**Student number 2024502225**

## Run the project

Use Node.js 20.19+ on the 20.x line, 22.12+ on the 22.x line, or Node.js 24.

```sh
npm install
npm run dev
npm run build
npm test
```

Open the local address printed by Vite. Add a task, then use **Next** to move it through To do → In progress → Done → To do. The filter counts are based on all tasks. **Clear done** removes all completed tasks across the list. The four screenshots in `screenshots/` show the same three tasks under each filter.

## Bonus 1: Undo

The state is `{ tasks, filter, past }`, where `past` is a `Task[][]` stack of earlier task lists. Each action that changes tasks saves the current list on the stack, and `undo` restores the newest saved list while keeping the active filter. The Undo button is disabled when the stack is empty.

## Bonus 2: Tests

The tests cover every reducer action, the full status cycle, immutability, repeated undo, and both filter helpers. The edge cases include unknown IDs, an empty list, clearing a list with no completed tasks, and counts after deletion.

```text
> task-manager-assignment3@0.0.0 test
> vitest run

 Test Files  2 passed (2)
      Tests  28 passed (28)
```

## Bonus 3: Explain your reducer

A reducer is pure when the same state and action produce the same next state without side effects. React can call the reducer more than once in development Strict Mode. If the reducer pushed directly into the old task array, the extra call could append a duplicate. Returning the same state object after changing it can also cause React to skip the update because it compares the old and new state by reference. For each real task change, I return a fresh state and task array. Advancing a task also creates a new object for that task, so the old status stays intact in the undo history.

The form creates the ID with `crypto.randomUUID()` before it dispatches `add`. The action carries the ID with the title, so the same action always produces the same task from the same starting state. A random call inside the reducer would give the task a different ID when React repeats the calculation or when a test replays the action.

`App` computes the visible tasks and the counts from `state.tasks` during each render. The visible list uses the selected filter, and the counts use the full list. If the Done count were stored separately, deleting a completed task could leave the Done button showing one while its list was empty.

Moving the filter into the reducer state made it easier to test how actions interact. I can select Done, clear completed tasks, and undo in a single test sequence, then check that the completed tasks return with Done still selected.

## Bonus 4: Git repository

[github.com/furkankaanunal/mis233-assignment3](https://github.com/furkankaanunal/mis233-assignment3)
