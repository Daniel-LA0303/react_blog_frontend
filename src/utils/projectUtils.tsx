/**
 * projectUtils
 * ---------------------------------------------------------------------------
 * Real service layer for the Kanban module, wired to `clientAuthAxios`.
 *
 * Every endpoint response follows this envelope:
 *   { timestamp, data, path, status, error, method, message }
 * On success `status` is 200/201 and the payload lives in `data`.
 * On failure clientAuthAxios/axios rejects the promise (non-2xx), which is
 * why every function below just returns `response.data.data` on the happy
 * path and lets the caller's try/catch read `error.response.data.message`
 * (same pattern already used across the app, see Post.tsx).
 *
 * NOTE — a few endpoints below don't exist yet in your backend snippet:
 *   - PATCH /project/update-project-status/:id   (project status: ACTIVE/ARCHIVED/DELETED)
 *   - PATCH /project/assign-task/:taskId         (set task.assignedTo)
 *   - PATCH /project/unassign-task/:taskId       (clear task.assignedTo)
 *   - PUT   /project/update-member               (invite/remove -> updateProjectMemberService)
 *   - GET   /user/search-users?query=            (generic user search)
 * Adjust the paths below to match your real routes; the request/response
 * shapes already match the services you shared (updateProjectMemberService,
 * updateTaskService, etc). Also: `updateTaskService` currently doesn't
 * persist `task.list`, so moving a task to another column won't survive a
 * refresh until you add that assignment — see the note at the bottom.
 */

import clientAuthAxios from '../services/clientAuthAxios'
import { KanbanList, KanbanTask, KanbanUser, ProjectStatus } from '../interfaces/projects.interfaces'

// unwraps { data, error, status, message } -> data
const unwrap = async <T,>(request: Promise<{ data: { data: T } }>): Promise<T> => {
  const response = await request
  return response.data.data
}

// -----------------------------------------------------------------------------
// project
// -----------------------------------------------------------------------------
export const createProject = (payload: { name: string; description: string }) =>
  unwrap<{ projectId: string }>(clientAuthAxios.post('/project/create-project', payload))

export const updateProject = (projectId: string, payload: { name: string; description: string }) =>
  unwrap<{ name: string; description: string }>(
    clientAuthAxios.put(`/project/update-project/${projectId}`, payload)
  )

// "eliminación por estado": no se borra el proyecto, se cambia su status
export const updateProjectStatus = (projectId: string, status: ProjectStatus) =>
  unwrap<{ status: ProjectStatus }>(
    clientAuthAxios.patch(`/project/update-project-status/${projectId}`, { status })
  )

// -----------------------------------------------------------------------------
// lists
// -----------------------------------------------------------------------------
export const createList = (projectId: string, name: string, position: number) =>
  unwrap<KanbanList>(clientAuthAxios.post('/project/list/create-list', { project: projectId, name, position }))

export const updateList = (listId: string, payload: { name: string; position: number }) =>
  unwrap<{ name: string; position: number }>(clientAuthAxios.put(`/project/list/update-list/${listId}`, payload))

// no bulk-reorder endpoint on the backend yet, so we persist every list's
// new position individually against updateListService
export const reorderLists = (
  _projectId: string,
  reindexedLists: { _id: string; name: string; order: number }[]
) => Promise.all(reindexedLists.map((l) => updateList(l._id, { name: l.name, position: l.order })))

// -----------------------------------------------------------------------------
// tasks
// -----------------------------------------------------------------------------
export const createTask = (
  listId: string,
  payload: { project: string; title: string; description: string; position: number; createdBy: string }
) =>
  unwrap<KanbanTask>(
    clientAuthAxios.post('/project/task/create-task', { ...payload, list: listId })
  )

export const updateTask = (
  taskId: string,
  payload: { title: string; description: string; position?: number }
) => unwrap<KanbanTask>(clientAuthAxios.put(`/project/task/update-task/${taskId}`, payload))

// same-list reorder AND cross-list move (sends `list` so the task's column
// actually changes — see the backend note at the bottom of this file)
export const moveTask = (
  taskId: string,
  payload: { title: string; description: string; position: number; list: string }
) => unwrap<KanbanTask>(clientAuthAxios.put(`/project/task/update-task/${taskId}`, payload))

export const deleteTask = (taskId: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.delete(`/project/task/delete-task/${taskId}`))

// -----------------------------------------------------------------------------
// members / assignment TODO
// -----------------------------------------------------------------------------
export const searchUsers = (query: string) =>
  unwrap<KanbanUser[]>(clientAuthAxios.get(`/users/search-users?query=${encodeURIComponent(query)}`))

// project members are already loaded client-side, so this is a local filter
// (no request needed) — kept async to match how it's called elsewhere
export const searchProjectMembers = async (query: string, members: KanbanUser[]) =>
  members.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))

// both map to updateProjectMemberService: status "ACTIVE" (invite) / "REMOVED"
export const inviteUserToProject = (projectId: string, userId: string) =>
  unwrap<{ ok: true }>(
    clientAuthAxios.post('/project/user', { projectId, userId, status: 'ACTIVE' })
  )

export const removeUserFromProject = (projectId: string, userId: string) =>
  unwrap<{ ok: true }>(
    clientAuthAxios.post('/project/user', { projectId, userId, status: 'REMOVED' })
  )

// task.assignedTo is a SINGLE user in your model — assigning replaces
// whoever was assigned before; unassigning clears it
export const assignUserToTask = (taskId: string, userId: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.patch(`/project/assign-task/${taskId}`, { userId }))

export const unassignUserFromTask = (taskId: string, _userId?: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.patch(`/project/unassign-task/${taskId}`))

/**
 * Two small backend additions needed for this to be fully functional:
 *
 * 1) updateTaskService needs to persist the list when it's provided, e.g.:
 *      if (request.list) task.list = request.list as any;
 *    (and add `list?: string;` to UpdateProjectTaskRequestI)
 *
 * 2) A tiny assignment service, mirroring updateProjectMemberService:
 *      const updateTaskAssignmentService = async (taskId: string, userId: string | null) => {
 *        const task = await ProjectTask.findById(taskId);
 *        if (!task) throw new ServiceException("Task not found", 404);
 *        task.assignedTo = userId as any;
 *        return task.save();
 *      };
 *    wired to PATCH /project/assign-task/:taskId (body { userId }) and
 *    PATCH /project/unassign-task/:taskId (userId: null).
 *
 * 3) A project status field/service (ACTIVE/ARCHIVED/DELETED) analogous to
 *    updateProjectService, wired to PATCH /project/update-project-status/:id.
 */