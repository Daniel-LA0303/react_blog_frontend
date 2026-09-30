

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface KanbanUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: { secure_url: string };
}

export interface KanbanProject {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  members: KanbanUser[];
}

export interface KanbanTask {
  _id: string;
  listId: string;
  title: string;
  description: string;
  order: number;
  priority: TaskPriority;
  assignedUsers: KanbanUser[];
}

export interface KanbanList {
  _id: string;
  projectId: string;
  name: string;
  order: number;
}

export interface KanbanBoard {
  project: KanbanProject;
  lists: KanbanList[];
  tasks: KanbanTask[];
}

export interface ProjectCollabItem {
  _id: string
  name: string
  description: string
  owner: { _id: string; name: string }
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}