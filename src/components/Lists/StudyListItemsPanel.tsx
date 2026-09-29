import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { useSwal } from '../../hooks/useSwal'
import { CloseIcon } from '../../utils/iconsUtils'
import { StudyListItem, StudyListItemResourceType } from '../../interfaces/lists.interfaces'
import { getStudyListItems, removeStudyListItem, reorderStudyListItems } from '../../utils/listsUtils'
import SmallSpinner from '../Spinner/SmallSpinner'

const RESOURCE_PATH: Record<StudyListItemResourceType, string> = {
  POST: 'post',
  QUIZ: 'quiz',
}

const InsertionBar = () => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-1 rounded-full bg-[#2563EB]" />
)

const StudyListItemsPanel = ({
  listId,
  dark,
  isOwner
}: {
  listId: string;
  dark: boolean;
  isOwner: boolean
}) => {

  const navigate = useNavigate()
  // whatever resourceId is currently open on the left (post or quiz route), if any
  const { id: activeResourceId } = useParams()
  const { showConfirmSwal } = useSwal()

  const [items, setItems] = useState<StudyListItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // drag state (same id-based approach used for the kanban board) 
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragIndicator, setDragIndicator] = useState<{ beforeItemId: string | null } | null>(null)

  const cleanupDrag = () => {
    setDraggedItemId(null)
    setDragIndicator(null)
  }

  // useeffect to get list of resources
  useEffect(() => {

    let cancelled = false

    const init = async () => {
      setLoading(true)
      try {
        const { items: first, meta } = await getStudyListItems(listId, 1, 10)
        if (cancelled) return
        setItems([...first].sort((a, b) => a.order - b.order))
        setTotalPages(meta.totalPages)
        setPage(1)
      } catch (error: any) {

        // show error
        showConfirmSwal({
          message: error.response?.data?.message || 'Could not load the items',
          status: 'error',
          confirmButton: true,
          cancelButton: false
        });
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }

  }, [listId])

  // to load more from list
  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {

      // get it
      const { items: next, meta } = await getStudyListItems(listId, page + 1, 10);

      // update state and order it
      setItems((prev) => [...prev, ...next].sort((a, b) => a.order - b.order))
      setTotalPages(meta.totalPages);
      setPage((p) => p + 1);
    } catch (error: any) {
      showConfirmSwal({
        message: error.response?.data?.message || 'Could not load more items',
        status: 'error',
        confirmButton: true,
        cancelButton: false
      });
    } finally {
      setLoadingMore(false)
    }
  }

  // select a resource
  const handleSelect = (item: StudyListItem) => {
    navigate(`/study-list/${listId}/${RESOURCE_PATH[item.resourceType]}/${item.resourceId}`)
  }

  // remove resource from list
  const handleRemove = async (item: StudyListItem) => {
    try {

      // call service
      await removeStudyListItem(listId, item._id)

      // update state
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (error: any) {
      showConfirmSwal({
        message: error.response?.data?.message || 'Could not remove the item',
        status: 'error',
        confirmButton: true,
        cancelButton: false
      });
    }
  }


  // reorder or update list order with draggeable
  // runs when the user releases the mouse (drops the item)
  const handleDrop = async () => {

    // nothing is being dragged, so there is nothing to do
    if (!draggedItemId) return

    // "which item do I go before?" If we never saved one, it means "go to the end"
    const indicator = dragIndicator ?? { beforeItemId: null }

    // backup of the list as it was, in case the backend fails and we need to undo
    const previous = items

    // work on a COPY ([...items]) sorted by order, so we never modify the real state directly
    const sorted = [...items].sort((a, b) => a.order - b.order)

    // where is the dragged item right now? (its position in the array)
    const fromIndex = sorted.findIndex((i) => i._id === draggedItemId)
    if (fromIndex === -1) {
      // not found (should not happen): clean up and stop
      cleanupDrag()
      return
    }

    // take the dragged item OUT of the array.
    // splice(fromIndex, 1) removes 1 element and returns it as [moved]
    const [moved] = sorted.splice(fromIndex, 1)

    // where does it go? Find the item we should be placed BEFORE.
    // We search AFTER removing the dragged item, so the positions are already correct.
    // findIndex returns -1 when there is no such item
    const rawTarget = indicator.beforeItemId
      ? sorted.findIndex((i) => i._id === indicator.beforeItemId)
      : -1

    // -1 means "no item to go before", so we go to the end (sorted.length)
    const targetIndex = rawTarget === -1 ? sorted.length : rawTarget

    // put the item back in its new position.
    // splice(targetIndex, 0, moved) means: at targetIndex, remove 0 elements, insert "moved"
    sorted.splice(targetIndex, 0, moved)

    // renumber everything by position: first item gets order 0, then 1, 2, 3...
    const reindexed = sorted.map((i, idx) => ({ ...i, order: idx }))

    cleanupDrag()          // reset drag state (removes the blue bar and the "faded" look)
    setItems(reindexed)    // update the screen right away (optimistic update)

    try {
      // now tell the backend the new order
      await reorderStudyListItems(listId, reindexed.map((i) => ({ _id: i._id, order: i.order })))
    } catch (error: any) {
      // the backend said no: put the list back exactly as it was and show the error
      setItems(previous)
      showConfirmSwal({ message: error.response?.data?.message || 'Could not save the new order', status: 'error', confirmButton: true, cancelButton: false })
    }
  }
  return (
    <aside className={`w-full lg:w-80 flex-shrink-0 rounded-2xl border flex flex-col max-h-[80vh] ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>

      <div className="px-4 pt-4 pb-2">
        <h2 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Items</h2>
      </div>


      <div
        className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2"
        onDragOver={(e) => {
          e.preventDefault()
          if (draggedItemId) setDragIndicator({ beforeItemId: null })
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (draggedItemId) handleDrop()
        }}
      >
        {loading ? (
          <SmallSpinner></SmallSpinner>
        ) : items.length === 0 ? (
          <p className={`text-xs text-center py-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>This list has no items yet.</p>
        ) : (
          <AnimatePresence initial={false}>

            {/* iterate to print items */}
            {items.map((item, index) => {


              const nextItem = items[index + 1]
              const isActive = item.resourceId === activeResourceId
              const showBarBefore = dragIndicator?.beforeItemId === item._id && draggedItemId !== item._id

              return (
                <div key={item._id}>
                  {showBarBefore && <InsertionBar />}
                  <motion.div
                    layout
                    draggable={isOwner} // only permit if is the owner
                    onDragStart={() => setDraggedItemId(item._id)}
                    onDragEnd={cleanupDrag}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!draggedItemId || draggedItemId === item._id) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      const before = e.clientY < rect.top + rect.height / 2
                      setDragIndicator({ beforeItemId: before ? item._id : nextItem ? nextItem._id : null })
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: draggedItemId === item._id ? 0.4 : 1, y: 0, scale: draggedItemId === item._id ? 0.97 : 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={() => handleSelect(item)}
                    className={`group/item flex items-center gap-2.5 rounded-xl border p-2.5 transition-colors ${isOwner ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                      } ${isActive
                        ? 'border-[#2563EB] bg-[#2563EB]/10'
                        : dark
                          ? 'border-gray-800 hover:border-gray-700'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 ${item.resourceType === 'QUIZ' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'
                        }`}
                    >
                      {item.resourceType}
                    </span>
                    <span className={`flex-1 min-w-0 text-xs font-medium truncate ${isActive ? 'text-[#2563EB]' : dark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {item.resource?.title ?? 'Untitled'}
                    </span>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(item)
                        }}
                        aria-label="Remove from list"
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400 hover:text-rose-500 flex-shrink-0"
                      >
                        <CloseIcon />
                      </button>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </AnimatePresence>
        )}

        {/*  */}
        {dragIndicator?.beforeItemId === null && draggedItemId && <InsertionBar />}

        {!loading && page < totalPages && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`mt-1 text-xs font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            {loadingMore ? <SmallSpinner></SmallSpinner> : 'Load more'}
          </button>
        )}
      </div>
    </aside>
  )
}

export default StudyListItemsPanel