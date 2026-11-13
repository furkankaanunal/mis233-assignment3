# Assignment 3 starter (sample Task Manager)

A complete Vite + React + TypeScript project. Nothing to copy or generate.

```
npm install
npm run dev       # open the address it prints
npm run build     # type check and build; must pass when you hand in
```

Needs Node.js 20.19 or newer (22 or 24 also work).

- `src/taskReducer.ts`: the reducer. You change it: the state becomes `{ tasks, filter }`
  and it gets two new actions (see the handout).
- `src/App.tsx`: keeps the state with `useReducer` and passes it down as props.
- `src/filter.ts`: the file you fill in.

Zip the whole folder without `node_modules` when you hand in.
