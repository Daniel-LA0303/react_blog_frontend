import clientAuthAxios from '../services/clientAuthAxios'
import { Badge, BadgeCondition, BadgeFilterStatus, BadgeListMeta, BadgeStatus } from '../interfaces/badges.interfaces'

// note: the route segment is "bagdes" (typo already live on the backend),
// kept as-is here to match it
const BASE = '/bagdes'

// GET responds as { data, meta } directly — no timestamp/status envelope
// like the other endpoints, so we read it as-is
export const getBadges = async (params: {
  page: number
  limit: number
  search?: string
  status?: BadgeFilterStatus
}) => {
  const { data } = await clientAuthAxios.get(`${BASE}/get-badges`, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status && params.status !== 'all' ? params.status : undefined,
    },
  })
  return { badges: (data.data ?? []) as Badge[], meta: data.meta as BadgeListMeta }
}

export const createBadge = async (payload: {
  name: string
  description: string
  img: string
  condition: BadgeCondition
  createdBy: string
}) => {
  const { data } = await clientAuthAxios.post(`${BASE}/create-badge`, payload)
  return data.data as Badge
}

export const updateBadge = async (
  badgeId: string,
  payload: { name: string; description: string; img: string; status: BadgeStatus; condition: BadgeCondition }
) => {
  const { data } = await clientAuthAxios.put(`${BASE}/update-badge/${badgeId}`, payload)
  return data.data as Badge
}

export const deleteBadge = async (badgeId: string) => {
  const { data } = await clientAuthAxios.delete(`${BASE}/delete-badge/${badgeId}`)
  return data.data as string
}

// uploads the file first — call this, then pass the returned secure_url as
// `img` in createBadge/updateBadge (the "upload image, then save json" flow)
export const uploadBadgeImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file) // adjust the field name here if your fileUpload/multer config expects a different key
  const { data } = await clientAuthAxios.post('/posts/image-post', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data as { public_id: string; secure_url: string }
}