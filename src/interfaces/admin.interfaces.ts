
export interface AdminCategory {
  _id: string
  name: string
  slug: string
  description: string
  postCount: number
  createdAt: string
  color: string
}

export type DialogMode = 'create' | 'edit' | null;

export interface FormState {
  name: string
  description: string
  color: string
}