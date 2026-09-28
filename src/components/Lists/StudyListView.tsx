import { useEffect, useState } from 'react'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

import { PenIcon, TrashIcon } from '../../utils/iconsUtils'
import { StudyList } from '../../interfaces/lists.interfaces'
import { deleteStudyList, getStudyList } from '../../utils/listsUtils'
import StudyListItemsPanel from './StudyListItemsPanel'
import StudyListFormModal from './StudyListFormModal'
import Sidebar from '../Sidebar/Sidebar'

export const StudyListView = () => {
    // NOTE: this route param is named `listId`, not `id` — the nested
    // post/quiz routes use `:id` (to match ViewPost/TakeQuiz's own
    // useParams() unmodified), so this has to be a different key or the
    // child route's id would shadow this one
    const { listId } = useParams()
    const navigate = useNavigate()
    const { userAuth } = useUserAuthContext()
    const { globalData } = useGlobalDataContext()
    const { showConfirmSwal } = useSwal()
    const dark = !globalData.themeGlobal

    const [list, setList] = useState<StudyList | null>(null)
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        if (!listId) return
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const data = await getStudyList(listId)
                if (!cancelled) setList(data)
            } catch (error: any) {
                showConfirmSwal({ message: error.response?.data?.message || 'Could not load this list', status: 'error', confirmButton: true, cancelButton: false })
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId])

    const isOwner = list ? list.owner === userAuth.userId : false

    const handleDelete = async () => {
        if (!listId) return
        try {
            await deleteStudyList(listId)
            showConfirmSwal({ message: 'List deleted', status: 'success', confirmButton: true, cancelButton: false })
            navigate('/study-lists') // adjust to wherever your "my lists" route lives
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'Could not delete the list', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmDelete(false)
        }
    }

    if (loading || !list || !listId) {
        return (
            <div className={`min-h-screen flex items-center justify-center text-sm ${dark ? 'bg-[#18181B] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                {loading ? 'Loading list...' : 'List not found'}
            </div>
        )
    }

    return (
        <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <Sidebar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* header */}
                <div className={`rounded-2xl border p-5 mb-5 flex items-start justify-between gap-4 flex-wrap ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{list.title}</h1>
                            <span
                                className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${list.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {list.status}
                            </span>
                        </div>
                        {list.description && <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{list.description}</p>}
                    </div>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <PenIcon isDark={dark} /> Edit
                            </button>
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                                <TrashIcon /> Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* split view: selected resource on the left, items aside on the right */}
                <div className="flex flex-col lg:flex-row gap-5 items-start">
                    <div className={`flex-1 min-w-0 rounded-2xl border overflow-hidden ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
                        <Outlet />
                    </div>

                    <StudyListItemsPanel listId={listId} dark={dark} isOwner={isOwner} />
                </div>
            </div>

            {showEditModal && (
                <StudyListFormModal
                    list={list}
                    dark={dark}
                    onClose={() => setShowEditModal(false)}
                    onSaved={(updated) => {
                        setList(updated)
                        setShowEditModal(false)
                    }}
                />
            )}

            {/* confirm delete */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmDelete(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                        >
                            <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Delete list</h3>
                            <p className={`mt-1.5 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>This list and its saved items will be removed. This can't be undone.</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="px-3 py-1.5 text-sm font-semibold rounded-lg text-white bg-rose-500 hover:bg-rose-600 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default StudyListView