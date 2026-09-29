import { StudyList, StudyListItem, StudyListItemsMeta, StudyListStatus } from '../interfaces/lists.interfaces'
import clientAuthAxios from '../services/clientAuthAxios'

const BASE = '/lists'

export const getStudyList = async (listId: string) => {
  const { data } = await clientAuthAxios.get(`${BASE}/study-lists/${listId}`)
  return data.data as StudyList
}

export const updateStudyList = async (
  listId: string,
  payload: { owner: string; title: string; description: string; status: StudyListStatus }
) => {
  const { data } = await clientAuthAxios.put(`${BASE}/update-study-list/${listId}`, payload)
  return data.data as StudyList
}

export const deleteStudyList = async (listId: string) => {
  const { data } = await clientAuthAxios.delete(`${BASE}/delete-study-list/${listId}`)
  return data.data
}

// response shape is { data: { data: [...items], meta: {...} }, ...envelope }
export const getStudyListItems = async (listId: string, page: number, limit: number) => {
  const { data } = await clientAuthAxios.get(`${BASE}/study-lists/${listId}/items`, { params: { page, limit } })
  return { items: (data.data.data ?? []) as StudyListItem[], meta: data.data.meta as StudyListItemsMeta }
}

export const addStudyListItem = async (listId: string, payload: { resourceType: 'POST' | 'QUIZ'; resourceId: string }) => {
  const { data } = await clientAuthAxios.post(`${BASE}/study-lists/${listId}/items`, payload)
  return data.data as StudyListItem
}

export const removeStudyListItem = async (listId: string, itemId: string) => {
  const { data } = await clientAuthAxios.delete(`${BASE}/study-lists/${listId}/items/${itemId}`)
  return data.data
}

// TODO: no reorder endpoint on the backend yet. This just logs the request
// we WOULD send once it exists — the UI already applies the new order
// locally (it's treated as a done deal, per spec), this is only the
// "here's what we need to send" placeholder.
export const reorderStudyListItems = async (listId: string, orderedItems: { _id: string; order: number }[]) => {

  const { data } = await clientAuthAxios.patch(`${BASE}/study-lists/${listId}/items/reorder`, 
    { 
      items: orderedItems 
    }
  );
  
  return data.data
}

export const getResourceListMembership = async (resourceType: 'POST' | 'QUIZ', resourceId: string) => {
  const { data } = await clientAuthAxios.get('/lists/study-lists/resource-membership', {
    params: { resourceType, resourceId },
  })
  return data.data as { listId: string; itemId: string }[]
}