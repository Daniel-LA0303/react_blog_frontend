// store/useKanbanStore.ts
import { create } from 'zustand'
import { KanbanList, KanbanProject, KanbanTask, KanbanUser } from '../../../../interfaces/projects.interfaces'

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order
const reindex = <T extends { order: number }>(arr: T[]) => arr.map((x, i) => ({ ...x, order: i }))

interface KanbanState {
  project: KanbanProject | null
  lists: KanbanList[]
  tasks: KanbanTask[]

  setBoard: (b: { project: KanbanProject; lists: KanbanList[]; tasks: KanbanTask[] }) => void
  reset: () => void

  patchProject: (p: Partial<KanbanProject>) => void
  addMember: (u: KanbanUser) => void
  removeMember: (userId: string) => void

  addList: (l: KanbanList) => void
  applyListOrder: (items: { _id: string; order: number }[]) => void

  addTask: (t: KanbanTask) => void
  patchTask: (id: string, p: Partial<KanbanTask>) => void
  removeTask: (id: string) => void
  moveTask: (taskId: string, toListId: string, toIndex: number) => void
  setAssignee: (taskId: string, user: KanbanUser | null) => void
}

export const useKanbanStore = create<KanbanState>((set) => ({
  project: null,
  lists: [],
  tasks: [],

  setBoard: ({ project, lists, tasks }) => set({ project, lists, tasks }),
  reset: () => set({ project: null, lists: [], tasks: [] }),

  patchProject: (p) => set((s) => (s.project ? { project: { ...s.project, ...p } } : s)),
  addMember: (u) =>
    set((s) =>
      s.project && !s.project.members.some((m) => m._id === u._id)
        ? { project: { ...s.project, members: [...s.project.members, u] } }
        : s
    ),
  removeMember: (userId) =>
    set((s) =>
      s.project
        ? { project: { ...s.project, members: s.project.members.filter((m) => m._id !== userId) } }
        : s
    ),

  // idempotentes: si ya existe no se duplica
  addList: (l) => set((s) => (s.lists.some((x) => x._id === l._id) ? s : { lists: [...s.lists, l] })),
  applyListOrder: (items) =>
    set((s) => ({
      lists: s.lists.map((l) => {
        const it = items.find((i) => i._id === l._id)
        return it ? { ...l, order: it.order } : l
      }),
    })),

  addTask: (t) => set((s) => (s.tasks.some((x) => x._id === t._id) ? s : { tasks: [...s.tasks, t] })),
  patchTask: (id, p) => set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? { ...t, ...p } : t)) })),
  removeTask: (id) =>
    set((s) => {
      const task = s.tasks.find((t) => t._id === id)
      if (!task) return s
      return {
        tasks: s.tasks
          .filter((t) => t._id !== id)
          .map((t) => (t.listId === task.listId && t.order > task.order ? { ...t, order: t.order - 1 } : t)),
      }
    }),

  moveTask: (taskId, toListId, toIndex) =>
    set((s) => {
      const moving = s.tasks.find((t) => t._id === taskId)
      if (!moving) return s
      const fromListId = moving.listId

      const fromTasks = s.tasks.filter((t) => t.listId === fromListId && t._id !== taskId).sort(byOrder)
      const toTasks = fromListId === toListId
        ? fromTasks
        : s.tasks.filter((t) => t.listId === toListId).sort(byOrder)

      toTasks.splice(Math.min(toIndex, toTasks.length), 0, { ...moving, listId: toListId })

      const rest = s.tasks.filter((t) => t.listId !== fromListId && t.listId !== toListId)
      return {
        tasks:
          fromListId === toListId
            ? [...rest, ...reindex(toTasks)]
            : [...rest, ...reindex(fromTasks), ...reindex(toTasks)],
      }
    }),

  setAssignee: (taskId, user) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t._id === taskId ? { ...t, assignedUsers: user ? [user] : [] } : t)),
    })),
}))