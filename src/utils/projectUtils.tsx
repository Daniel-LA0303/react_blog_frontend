/**
 * kanbanService
 * ---------------------------------------------------------------------------
 * Fake service layer for the Kanban module.
 *
 * There is no real backend yet, so every function here:
 *   1. Simulates network latency (setTimeout)
 *   2. Logs the request that WOULD be sent (method, url, body) via `logRequest`
 *   3. Resolves with the data the UI needs to update local state
 *
 * When the real endpoints exist, swap the body of each function for a call to
 * `clientAuthAxios` (same pattern used elsewhere in the app, see Post.tsx),
 * keep the same function signatures, and the view won't need to change.
 */

import { KanbanBoard, KanbanList, KanbanProject, KanbanTask, KanbanUser, ProjectStatus, TaskPriority } from "../interfaces/projects.interfaces";



// -----------------------------------------------------------------------------
// request logger
// -----------------------------------------------------------------------------
const logRequest = (method: string, url: string, body?: unknown) => {
  // eslint-disable-next-line no-console
  console.log(
    `%c[kanban] ${method} ${url}`,
    'color:#2563EB;font-weight:600;',
    body !== undefined ? body : ''
  );
};

const delay = <T,>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// -----------------------------------------------------------------------------
// fake directory of users (for search / invite / assign)
// -----------------------------------------------------------------------------
export const FAKE_USERS: KanbanUser[] = [
  { _id: 'u_ana', name: 'Ana Torres', email: 'ana.torres@mail.com' },
  { _id: 'u_luis', name: 'Luis Fernández', email: 'luis.fernandez@mail.com' },
  { _id: 'u_maria', name: 'María Gómez', email: 'maria.gomez@mail.com' },
  { _id: 'u_carlos', name: 'Carlos Ruiz', email: 'carlos.ruiz@mail.com' },
  { _id: 'u_paola', name: 'Paola Jiménez', email: 'paola.jimenez@mail.com' },
  { _id: 'u_diego', name: 'Diego Herrera', email: 'diego.herrera@mail.com' },
];

/**
 * Builds a fake board seeded with the currently authenticated user as the
 * project owner, so permission checks ("only the creator can invite") work
 * out of the box while you test against fake data.
 */
export const buildFakeBoard = (currentUser: KanbanUser): KanbanBoard => {
  const project: KanbanProject = {
    _id: 'proj_001',
    name: 'Rediseño plataforma editorial',
    description: 'Tablero de trabajo para el rediseño del feed de posts y el panel de autor.',
    status: 'ACTIVE',
    owner: currentUser,
    members: [currentUser, FAKE_USERS[0], FAKE_USERS[1]],
  };

  const lists: KanbanList[] = [
    { _id: 'list_todo', projectId: project._id, name: 'To do', order: 0 },
    { _id: 'list_progress', projectId: project._id, name: 'In Progress', order: 1 },
    { _id: 'list_review', projectId: project._id, name: 'IN Review', order: 2 },
    { _id: 'list_done', projectId: project._id, name: 'Done', order: 3 },
  ];

  const tasks: KanbanTask[] = [
    {
      _id: 'task_1',
      listId: 'list_todo',
      title: 'Definir wireframes del tablero Kanban',
      description: 'Bocetar columnas, tarjetas y estados antes de picar código.',
      order: 0,
      priority: 'HIGH',
      assignedUsers: [currentUser],
    },
    {
      _id: 'task_2',
      listId: 'list_todo',
      title: 'Listar endpoints necesarios para el board',
      description: '',
      order: 1,
      priority: 'MEDIUM',
      assignedUsers: [],
    },
    {
      _id: 'task_3',
      listId: 'list_progress',
      title: 'Maquetar tarjeta de tarea',
      description: 'Reusar estilos de Post.tsx (radius, dark mode, hover).',
      order: 0,
      priority: 'MEDIUM',
      assignedUsers: [FAKE_USERS[0]],
    },
    {
      _id: 'task_4',
      listId: 'list_review',
      title: 'Revisar accesos de invitación al proyecto',
      description: 'Solo el creador del proyecto debe poder invitar usuarios.',
      order: 0,
      priority: 'LOW',
      assignedUsers: [FAKE_USERS[1], currentUser],
    },
    {
      _id: 'task_5',
      listId: 'list_done',
      title: 'Definir paleta y tipografía del board',
      description: '',
      order: 0,
      priority: 'LOW',
      assignedUsers: [],
    },
  ];

  return { project, lists, tasks };
};

// -----------------------------------------------------------------------------
// board
// -----------------------------------------------------------------------------
export const getProjectBoard = async (projectId: string, board: KanbanBoard) => {
  logRequest('GET', `/projects/${projectId}/board`);
  return delay(board);
};

// -----------------------------------------------------------------------------
// project
// -----------------------------------------------------------------------------
export const createProject = async (payload: { name: string; description: string }) => {
  logRequest('POST', '/projects', payload);
  return delay({ _id: uid('proj'), status: 'ACTIVE' as ProjectStatus, ...payload });
};

export const updateProject = async (
  projectId: string,
  payload: { name: string; description: string }
) => {
  logRequest('PUT', `/projects/${projectId}`, payload);
  return delay({ ok: true });
};

// "eliminación por estado": no se borra el proyecto, se cambia su status
// (ACTIVE -> ARCHIVED -> DELETED), igual que como se filtran los posts.
export const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
  logRequest('PATCH', `/projects/${projectId}/status`, { status });
  return delay({ status });
};

// -----------------------------------------------------------------------------
// lists
// -----------------------------------------------------------------------------
export const createList = async (projectId: string, name: string) => {
  logRequest('POST', `/projects/${projectId}/lists`, { name });
  return delay<KanbanList>({ _id: uid('list'), projectId, name, order: 999 });
};

export const reorderLists = async (
  projectId: string,
  orderedListIds: string[]
) => {
  logRequest('PATCH', `/projects/${projectId}/lists/reorder`, { orderedListIds });
  return delay({ ok: true });
};

// -----------------------------------------------------------------------------
// tasks
// -----------------------------------------------------------------------------
export const createTask = async (
  listId: string,
  payload: { title: string; description?: string; priority: TaskPriority }
) => {
  logRequest('POST', `/lists/${listId}/tasks`, payload);
  return delay<KanbanTask>({
    _id: uid('task'),
    listId,
    title: payload.title,
    description: payload.description ?? '',
    priority: payload.priority,
    order: 999,
    assignedUsers: [],
  });
};

export const updateTask = async (
  taskId: string,
  payload: Partial<Pick<KanbanTask, 'title' | 'description' | 'priority'>>
) => {
  logRequest('PUT', `/tasks/${taskId}`, payload);
  return delay({ ok: true });
};

export const moveTask = async (
  taskId: string,
  payload: { fromListId: string; toListId: string; toOrder: number }
) => {
  logRequest('PATCH', `/tasks/${taskId}/move`, payload);
  return delay({ ok: true });
};

export const deleteTask = async (taskId: string) => {
  logRequest('DELETE', `/tasks/${taskId}`);
  return delay({ ok: true });
};

// -----------------------------------------------------------------------------
// members / assignment
// -----------------------------------------------------------------------------
export const searchUsers = async (query: string) => {
  logRequest('GET', `/users/search?q=${encodeURIComponent(query)}`);
  const results = FAKE_USERS.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())
  );
  return delay(results, 250);
};

// Search restricted to the project's own members (used when assigning a task,
// as opposed to `searchUsers`, which looks across every user for invites).
export const searchProjectMembers = async (
  projectId: string,
  query: string,
  members: KanbanUser[]
) => {
  logRequest('GET', `/projects/${projectId}/members/search?q=${encodeURIComponent(query)}`);
  const results = members.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())
  );
  return delay(results, 200);
};

export const inviteUserToProject = async (projectId: string, userId: string) => {
  logRequest('POST', `/projects/${projectId}/invite`, { userId });
  return delay({ ok: true });
};

export const removeUserFromProject = async (projectId: string, userId: string) => {
  logRequest('DELETE', `/projects/${projectId}/members/${userId}`);
  return delay({ ok: true });
};

export const assignUserToTask = async (taskId: string, userId: string) => {
  logRequest('POST', `/tasks/${taskId}/assign`, { userId });
  return delay({ ok: true });
};

export const unassignUserFromTask = async (taskId: string, userId: string) => {
  logRequest('POST', `/tasks/${taskId}/unassign`, { userId });
  return delay({ ok: true });
};