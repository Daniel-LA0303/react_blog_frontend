import clientAuthAxios from '../services/clientAuthAxios'
import { KanbanList, KanbanTask, KanbanUser, ProjectStatus } from '../interfaces/projects.interfaces'

// unwraps { data, error, status, message } -> data
const unwrap = async <T,>(request: Promise<{ data: { data: T } }>): Promise<T> => {
  const response = await request
  return response.data.data
}

// project
export const createProject = (payload: { name: string; description: string, owner: string }) =>
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

// lists
export const createList = (projectId: string, name: string, position: number) =>
  unwrap<KanbanList>(clientAuthAxios.post('/project/list/create-list', { project: projectId, name, position }))

export const updateList = (listId: string, payload: { name: string; position: number }) =>
  unwrap<{ name: string; position: number }>(clientAuthAxios.put(`/project/list/update-list/${listId}`, payload))

// tasks
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

export const moveTask = (
  taskId: string,
  payload: { title: string; description: string; position: number; list: string }
) => unwrap<KanbanTask>(clientAuthAxios.put(`/project/task/update-task/${taskId}`, payload))

export const deleteTask = (taskId: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.delete(`/project/task/delete-task/${taskId}`))

// members / assignment TODO
export const searchUsers = (query: string) =>
  unwrap<KanbanUser[]>(clientAuthAxios.get(`/users/search-users?query=${encodeURIComponent(query)}`))

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

export const assignUserToTask = (taskId: string, userId: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.patch(`/project/assign-task/${taskId}`, { userId }))

export const unassignUserFromTask = (taskId: string, _userId?: string) =>
  unwrap<{ ok: true }>(clientAuthAxios.patch(`/project/unassign-task/${taskId}`))

export const reorderLists = (projectId: string, lists: { _id: string; order: number }[]) =>
  unwrap<{ ok: true }>(
    clientAuthAxios.put('/project/list/reorder', {
      projectId,
      lists: lists.map(({ _id, order }) => ({ _id, order })),
    })
  )