import { AdminCategory } from "../interfaces/admin.interfaces"

export const PALETTE = [
  '#2563EB', '#1D9E75', '#D85A30', '#7F77DD',
  '#D4537E', '#BA7517', '#0891b2', '#65a30d',
]

export const FAKE_CATS: AdminCategory[] = [
  { _id: '1', name: 'Technology',   slug: 'technology',   description: 'Software, hardware, and everything in between.', postCount: 42, createdAt: '2024-01-05', color: '#2563EB' },
  { _id: '2', name: 'Design',       slug: 'design',       description: 'UI, UX, branding, and visual communication.',     postCount: 28, createdAt: '2024-01-06', color: '#D4537E' },
  { _id: '3', name: 'Productivity', slug: 'productivity', description: 'Tools and habits to get more done.',             postCount: 17, createdAt: '2024-01-08', color: '#1D9E75' },
  { _id: '4', name: 'Finance',      slug: 'finance',      description: 'Personal finance, investing, and economics.',    postCount: 11, createdAt: '2024-01-10', color: '#BA7517' },
  { _id: '5', name: 'Health',       slug: 'health',       description: 'Wellness, fitness, and mental health topics.',   postCount: 9,  createdAt: '2024-02-01', color: '#65a30d' },
  { _id: '6', name: 'News',         slug: 'news',         description: 'Current events and breaking stories.',           postCount: 24, createdAt: '2024-02-15', color: '#0891b2' },
  { _id: '7', name: 'Marketing',    slug: 'marketing',    description: 'Growth, SEO, and content strategies.',           postCount: 15, createdAt: '2024-03-01', color: '#D85A30' },
  { _id: '8', name: 'Uncategorized',slug: 'uncategorized',description: 'Posts without a specific category.',             postCount: 6,  createdAt: '2024-01-01', color: '#888780' },
]

export function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
