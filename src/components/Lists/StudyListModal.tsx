import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clientAuthAxios from '../../services/clientAuthAxios'
import UIModal from '../Global/UIModal'
import SmallSpinner from '../Spinner/SmallSpinner'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { getResourceListMembership } from '../../utils/listsUtils'

type StudyList = {
    _id: string
    owner: string
    title: string
    description: string
    status: 'ACTIVE' | 'HIDDEN'
    createdAt: string
    updatedAt: string
}

type StudyListModalProps = {
    open: boolean
    onClose: () => void
    dark: boolean
    resourceId?: string
    resourceType?: 'POST' | 'QUIZ'
    onAddToList?: (
        listId: string,
        resourceId: string,
        resourceType: 'POST' | 'QUIZ'
    ) => Promise<void>
}

const LIMIT = 10

const StudyListModal = ({
    open,
    onClose,
    dark,
    resourceId,
    resourceType,
    onAddToList,
}: StudyListModalProps) => {

    const { userAuth } = useUserAuthContext();

    const [mode, setMode] = useState<'SELECT' | 'CREATE'>('SELECT')

    const [lists, setLists] = useState<StudyList[]>([])
    const [selectedListId, setSelectedListId] = useState<string | null>(null)

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingLists, setLoadingLists] = useState(false)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [creating, setCreating] = useState(false)
    const [adding, setAdding] = useState(false)

    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    const [savedItemByList, setSavedItemByList] = useState<Record<string, string>>({})

    // reset modal state
    useEffect(() => {
        if (!open) return

        setMode('SELECT')
        setLists([])
        setSelectedListId(null)
        setPage(1)
        setHasMore(true)

        setSavedItemByList({})
        setTitle('')
        setDescription('')
    }, [open])

    // get lists
    const fetchLists = useCallback(async (pageToLoad: number) => {
        if (loadingLists) return
        if (!hasMore && pageToLoad !== 1) return
        try {
            setLoadingLists(true)

            const response = await clientAuthAxios.get('/lists/study-lists-by-owner', { params: { page: pageToLoad, limit: LIMIT, }, })
            const result = response.data?.data
            const newLists: StudyList[] = result?.data ?? []
            const meta = result?.meta

            setLists((prev) =>
                pageToLoad === 1
                    ? newLists
                    : [...prev, ...newLists]
            )

            const totalPages = meta?.totalPages ?? 1
            setHasMore(pageToLoad < totalPages)
            setPage(pageToLoad)
        } finally {
            setLoadingLists(false)
        }
    }, [loadingLists, hasMore])

    // charge first page
    useEffect(() => {
        if (!open || mode !== 'SELECT') return

        fetchLists(1)
    }, [open, mode]);

    useEffect(() => {
        if (!open || !resourceId || !resourceType) return

        getResourceListMembership(resourceType, resourceId)
            .then((memberships) => {
                console.log('membership response:', memberships) // <-- temporal
                const map: Record<string, string> = {}
                memberships.forEach((m) => { map[m.listId] = m.itemId })
                setSavedItemByList(map)
            })
            .catch((err) => {
                console.error('membership error:', err?.response?.data || err) // <-- temporal
            })
    }, [open, resourceId, resourceType])

    // infinite scroll
    useEffect(() => {
        if (!open || mode !== 'SELECT') return

        const target = loadMoreRef.current

        if (!target) return

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0]
                if (firstEntry.isIntersecting && !loadingLists && hasMore) {
                    fetchLists(page + 1)
                }
            },
            {
                root: null,
                threshold: 0.1,
            }
        )

        observer.observe(target)
        return () => observer.disconnect()
    }, [open, mode, page, hasMore, loadingLists, fetchLists,]);

    const handleCreateList = async () => {
        if (!title.trim() || creating) return

        try {
            setCreating(true)

            const response = await clientAuthAxios.post(
                '/lists/create-study-list',
                { owner: userAuth.userId, title: title.trim(), description: description.trim(), }
            )

            const createdList: StudyList = response.data?.data

            if (!createdList?._id) return

            // set new list
            setLists((prev) => [
                createdList,
                ...prev,
            ])

            // set new element to this list
            setSelectedListId(createdList._id)

            setTitle('')
            setDescription('')

            setMode('SELECT')
        } finally {
            setCreating(false)
        }
    }

    // add new element
    const handleAddToList = async () => {
        if (!selectedListId || !resourceId || !resourceType || !onAddToList || adding) {
            return
        }

        try {
            setAdding(true)

            await onAddToList(
                selectedListId,
                resourceId,
                resourceType
            )

            onClose()
        } finally {
            setAdding(false)
        }
    }

    const canCreate = title.trim().length > 0

    return (
        <UIModal
            open={open}
            onClose={onClose}
            dark={dark}
            maxWidth={430}
        >
            <AnimatePresence mode="wait" initial={false}>
                {mode === 'SELECT' ? (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.16 }}
                    >
                        {/* Header */}
                        <div className={`px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                            <h2 className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Add to study list
                            </h2>

                            <p className={`mt-1 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Choose a list to save this resource.
                            </p>
                        </div>

                        {/* Lists */}
                        <div
                            className="px-3 py-2 overflow-y-auto ui-scroll-y"
                            style={{
                                maxHeight: 360,
                            }}
                        >
                            {lists.length === 0 && !loadingLists ? (
                                <div className="px-3 py-10 text-center">
                                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        You don't have any study lists yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {lists.map((list) => {
                                        const selected = selectedListId === list._id
                                        const alreadySaved = !!savedItemByList[list._id] // <-- nuevo

                                        return (
                                            <button
                                                key={list._id}
                                                type="button"
                                                disabled={alreadySaved}
                                                onClick={() => setSelectedListId(list._id)}
                                                className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                                                    alreadySaved
                                                        ? dark ? 'opacity-60 cursor-default' : 'opacity-60 cursor-default'
                                                        : selected
                                                            ? dark ? 'bg-blue-500/10' : 'bg-blue-50'
                                                            : dark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <span
                                                    className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                                        alreadySaved || selected
                                                            ? 'bg-blue-600 border-blue-600'
                                                            : dark ? 'border-gray-600' : 'border-gray-300'
                                                    }`}
                                                >
                                                    {(alreadySaved || selected) && (
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12l4 4L19 6" />
                                                        </svg>
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1">
                                                    <span className={`block text-sm font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                        {list.title}
                                                    </span>
                                                    {alreadySaved ? (
                                                        <span className="block mt-0.5 text-xs text-blue-500">Already saved here</span>
                                                    ) : list.description && (
                                                        <span className={`block mt-0.5 text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            {list.description}
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Infinite scroll sentinel */}
                            <div
                                ref={loadMoreRef}
                                className="h-8 flex items-center justify-center"
                            >
                                {loadingLists && (
                                    <SmallSpinner />
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-5 py-4 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                            <button
                                type="button"
                                onClick={() => setMode('CREATE')}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${dark ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span className="text-lg leading-none">
                                    +
                                </span>
                                Create new list
                            </button>

                            {selectedListId && (
                                <button
                                    type="button"
                                    onClick={handleAddToList}
                                    disabled={
                                        adding ||
                                        !resourceId ||
                                        !resourceType ||
                                        !onAddToList
                                    }
                                    className="mt-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 text-sm font-medium transition-colors"
                                >
                                    {adding
                                        ? 'Adding...'
                                        : 'Add to list'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.16 }}
                    >
                        {/* Header */}
                        <div className={`px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                            <button
                                type="button"
                                onClick={() => setMode('SELECT')}
                                className={`mb-3 text-xs ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                                Back
                            </button>

                            <h2 className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Create study list
                            </h2>

                            <p className={`mt-1 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Create a list to organize your learning.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="px-5 py-5 space-y-4">
                            <div>
                                <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`} >
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. JavaScript Fundamentals"
                                    maxLength={100}
                                    autoFocus
                                    className={`w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-colors ${dark
                                        ? 'bg-[#27272A] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500'
                                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                    <span className={`ml-1 font-normal ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        optional
                                    </span>
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="What are you learning?"
                                    maxLength={300}
                                    rows={3}
                                    className={`w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none border transition-colors ${dark
                                        ? 'bg-[#27272A] border-gray-700 text-white placeholder:text-gray-600 focus:border-blue-500'
                                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-5 py-4 border-t flex gap-2 ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                            <button
                                type="button"
                                onClick={() => setMode('SELECT')}
                                className={`flex-1 rounded-xl py-2.5 text-sm font-medium ${dark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCreateList}
                                disabled={!canCreate || creating}
                                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 text-sm font-medium transition-colors"
                            >
                                {creating ? 'Creating...' : 'Create list'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </UIModal>
    )
}

export default StudyListModal