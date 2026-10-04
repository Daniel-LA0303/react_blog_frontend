import { Fragment, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import {
    updateProject,
    updateProjectStatus,
    createList,
    reorderLists,
    createTask,
    moveTask,
    deleteTask,
    searchUsers,
    inviteUserToProject,
    removeUserFromProject,
    assignUserToTask,
    unassignUserFromTask,
    updateTask,
} from '../../utils/projectUtils'
import { ConfirmState, KanbanTask, KanbanUser, ProjectStatus } from '../../interfaces/projects.interfaces'
import TaskCard from '../../components/Project/TaskCard'
import Avatar from '../../components/Project/Avatar'
import { AddCircleIcon, CloseIcon, DeleteIcon, ListIcon, PenIcon, RestoreIcon, SearchIcon } from '../../utils/iconsUtils'
import Spinner from '../../components/Spinner/Spinner'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useKanbanStore } from '../../context/hooks/webSockets/kanban/useKanbanStore'
import { useProjectSocket } from '../../context/hooks/webSockets/kanban/useProjectSocket'
import ProjectEventCard, { ProjectEventI } from '../../components/Project/ProjectEventCard'

const ConfirmDialog = ({ open, title, message, danger, dark, onConfirm, onCancel }: {
    open: boolean
    title: string
    message: string
    danger?: boolean
    dark: boolean
    onConfirm: () => void
    onCancel: () => void
}) => (
    <AnimatePresence>
        {open && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                >
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <p className={`mt-1.5 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-lg text-white transition-colors ${danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#2563EB] hover:bg-blue-700'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)

const InsertionBar = ({ axis }: { axis: 'x' | 'y' }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={axis === 'y' ? 'h-1 rounded-full bg-[#2563EB] mx-1' : 'w-1 self-stretch rounded-full bg-[#2563EB] flex-shrink-0'}
    />
)

export const KanbanBoard = () => {
    const { userAuth } = userUserAuthContext()
    const { showConfirmSwal } = useSwal()
    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal
    const { id } = useParams()

    const currentUser: KanbanUser = useMemo(
        () => ({
            _id: userAuth?.userId ?? 'me',
            name: (userAuth as any)?.name || 'Tú',
            email: (userAuth as any)?.email || '',
            profilePicture: (userAuth as any)?.profilePicture,
        }),
        [userAuth]
    )

    // ---- board data lives in zustand (shared with the socket listeners) ----
    const project = useKanbanStore((s) => s.project)
    const lists = useKanbanStore((s) => s.lists)
    const tasks = useKanbanStore((s) => s.tasks)
    const {
        setBoard,
        reset,
        patchProject,
        addMember,
        removeMember,
        addList,
        applyListOrder,
        addTask,
        patchTask,
        removeTask,
        moveTask: moveTaskLocal,
        setAssignee,
    } = useKanbanStore.getState() // actions are stable references

    // ---- local UI state ----
    const [editingProject, setEditingProject] = useState(false)
    const [projectForm, setProjectForm] = useState({ name: '', description: '' })

    const [addingListOpen, setAddingListOpen] = useState(false)
    const [newListName, setNewListName] = useState('')

    const [addingTaskListId, setAddingTaskListId] = useState<string | null>(null)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null)

    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteQuery, setInviteQuery] = useState('')
    const [inviteResults, setInviteResults] = useState<KanbanUser[]>([])

    const [confirmState, setConfirmState] = useState<ConfirmState>(null);
    const [lastActivity, setLastActivity] = useState<ProjectEventI[]>([]);

    // drag & drop
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
    const [taskDragIndicator, setTaskDragIndicator] = useState<{ listId: string; beforeTaskId: string | null } | null>(null)
    const [draggedListId, setDraggedListId] = useState<string | null>(null)
    const [listDragIndicator, setListDragIndicator] = useState<{ beforeListId: string | null } | null>(null)

    const cleanupTaskDrag = () => {
        setDraggedTaskId(null)
        setTaskDragIndicator(null)
    }

    const cleanupListDrag = () => {
        setDraggedListId(null)
        setListDragIndicator(null)
    }

    const showError = (error: any, fallback: string) =>
        showConfirmSwal({
            message: error?.response?.data?.message || fallback,
            status: 'error',
            confirmButton: true,
            cancelButton: false,
        })

    // ---- load board (also used by the socket hook to resync) ----
    const loadBoard = async () => {
        try {
            const { data } = await clientAuthAxios.get(`/project/get-project/${id}`)
            console.log(data);
            setLastActivity(data.data.lastAcivity);
            setBoard(data.data)
            setProjectForm({ name: data.data.project.name, description: data.data.project.description })
        } catch (error: any) {
            showError(error, 'No se pudo cargar el proyecto')
        }
    }

    useEffect(() => {
        loadBoard()
        return () => reset()
    }, [id])

    // real time: join room + listeners
    useProjectSocket(id, loadBoard, (event) =>
        setLastActivity((prev) =>
            prev.some((e) => e._id === event._id)
                ? prev                              // prevent duplicate
                : [event, ...prev].slice(0, 10)     // add new
        )
    )

    // search users to invite
    useEffect(() => {
        if (!showInviteModal || !project) return
        const run = async () => {
            try {
                const results = await searchUsers(inviteQuery.trim())
                const memberIds = new Set(project.members.map((m) => m._id))
                setInviteResults(results.filter((u) => !memberIds.has(u._id)))
            } catch {
                setInviteResults([])
            }
        }
        run()
    }, [inviteQuery, showInviteModal])

    const isOwner = project ? project.owner === currentUser._id : false
    const isProjectDeleted = project?.status === 'DELETED'

    const sortedLists = useMemo(() => [...lists].sort((a, b) => a.order - b.order), [lists])

    const tasksByList = (listId: string) =>
        tasks.filter((t) => t.listId === listId).sort((a, b) => a.order - b.order)

    // ---- project ----
    const handleSaveProject = async () => {
        if (!project) return
        try {
            await updateProject(project._id, projectForm)
            patchProject(projectForm)
            setEditingProject(false)
        } catch (error: any) {
            showError(error, 'There was an error to update project.')
        }
    }

    const handleChangeStatus = async (status: ProjectStatus) => {
        if (!project) return
        try {
            await updateProjectStatus(project._id, status)
            patchProject({ status })
        } catch (error: any) {
            showError(error, 'There was an error to update status project.')
        } finally {
            setConfirmState(null)
        }
    }

    // ---- lists ----
    const handleAddList = async () => {
        if (!project || !newListName.trim()) return
        try {
            const created = await createList(project._id, newListName.trim(), lists.length)
            addList({ ...created, order: lists.length })
            setNewListName('')
            setAddingListOpen(false)
        } catch (error: any) {
            showError(error, 'There was an error to add new list.')
        }
    }

    const handleListDrop = () => {
        if (!project || !draggedListId) {
            cleanupListDrag()
            return
        }
        const sorted = [...sortedLists]
        const fromIndex = sorted.findIndex((l) => l._id === draggedListId)
        if (fromIndex === -1) {
            cleanupListDrag()
            return
        }

        const [moved] = sorted.splice(fromIndex, 1)
        const beforeId = listDragIndicator?.beforeListId
        const rawTarget = beforeId ? sorted.findIndex((l) => l._id === beforeId) : -1
        sorted.splice(rawTarget === -1 ? sorted.length : rawTarget, 0, moved)

        const reindexed = sorted.map((l, i) => ({ ...l, order: i }))
        applyListOrder(reindexed) // immediate UI
        reorderLists(project._id, reindexed).catch(loadBoard) // if it fails, resync
        cleanupListDrag()
    }

    // ---- tasks ----
    const handleAddTask = async (listId: string) => {
        if (!project || !newTaskTitle.trim()) return
        try {
            const order = tasksByList(listId).length
            const created = await createTask(listId, {
                project: project._id,
                title: newTaskTitle.trim(),
                description: '',
                position: order,
                createdBy: currentUser._id,
            })
            addTask({ ...created, listId, assignedUsers: [], order })
            setNewTaskTitle('')
            setAddingTaskListId(null)
        } catch (error: any) {
            showError(error, 'No se pudo crear la tarea')
        }
    }

    const handleDeleteTask = async (task: KanbanTask) => {
        try {
            await deleteTask(task._id)
            removeTask(task._id)
        } catch (error: any) {
            showError(error, 'No se pudo eliminar la tarea')
        } finally {
            setConfirmState(null)
        }
    }

    const onSaveEditTask = async (taskId: string, title: string, description: string): Promise<KanbanTask> => {
        const updated = await updateTask(taskId, { title, description })
        patchTask(updated._id, { title: updated.title, description: updated.description })
        return updated
    }

    // toIndex = position among the target list WITHOUT the dragged task
    const performMoveTask = (taskId: string, toListId: string, toIndex: number) => {
        const task = useKanbanStore.getState().tasks.find((t) => t._id === taskId)
        if (!task) return
        moveTaskLocal(taskId, toListId, toIndex) // immediate UI
        moveTask(taskId, {
            title: task.title,
            description: task.description,
            position: toIndex,
            list: toListId,
        }).catch(loadBoard) // if it fails, resync
    }

    const handleTaskDrop = (listId: string) => {
        if (!draggedTaskId) return
        const dragged = tasks.find((t) => t._id === draggedTaskId)
        if (!dragged) {
            cleanupTaskDrag()
            return
        }
        const beforeTaskId = taskDragIndicator?.listId === listId ? taskDragIndicator.beforeTaskId : null
        const siblings = tasks.filter((t) => t.listId === listId && t._id !== dragged._id).sort((a, b) => a.order - b.order)
        const idx = beforeTaskId ? siblings.findIndex((t) => t._id === beforeTaskId) : -1
        performMoveTask(dragged._id, listId, idx === -1 ? siblings.length : idx)
        cleanupTaskDrag()
    }

    // ---- assignment ----
    const handleAssign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await assignUserToTask(task._id, user._id)
            setAssignee(task._id, user)
            setAssigningTaskId(null)
        } catch (error: any) {
            showError(error, 'No se pudo asignar al usuario')
        }
    }

    const handleUnassign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await unassignUserFromTask(task._id, user._id)
            setAssignee(task._id, null)
            setAssigningTaskId(null)
        } catch (error: any) {
            showError(error, 'No se pudo quitar al usuario')
        }
    }

    // ---- members ----
    const handleInvite = async (user: KanbanUser) => {
        if (!project) return
        try {
            await inviteUserToProject(project._id, user._id)
            addMember(user)
            setInviteResults((prev) => prev.filter((u) => u._id !== user._id))
        } catch (error: any) {
            showError(error, 'No se pudo invitar al usuario')
        }
    }

    const handleRemoveMember = async (user: KanbanUser) => {
        if (!project) return
        try {
            await removeUserFromProject(project._id, user._id)
            removeMember(user._id)
        } catch (error: any) {
            showError(error, 'No se pudo quitar al usuario del proyecto')
        } finally {
            setConfirmState(null)
        }
    }

    if (!project) return <Spinner />

    return (
        <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <Sidebar />
            <div className="max-w-full mx-0 lg:mx-20 px-4 sm:px-6 py-6">
                {/* ---- project header ---- */}
                <div className={`rounded-2xl border p-5 mb-6 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
                    {isProjectDeleted && (
                        <div className="mb-3 px-3 py-2 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            This Project has been deleted
                        </div>
                    )}

                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-[240px]">
                            {editingProject ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
                                        className={`text-lg font-bold rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    />
                                    <textarea
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                                        rows={2}
                                        className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border resize-none ${dark ? 'bg-[#18181B] border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveProject} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700">
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProjectForm({ name: project.name, description: project.description })
                                                setEditingProject(false)
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h1>
                                    {isOwner && !isProjectDeleted && (
                                        <button
                                            onClick={() => {
                                                // sync the form with the latest data (it may have changed via socket)
                                                setProjectForm({ name: project.name, description: project.description })
                                                setEditingProject(true)
                                            }}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            aria-label="Editar proyecto"
                                        >
                                            <PenIcon isDark={dark} />
                                        </button>
                                    )}
                                </div>
                            )}
                            {!editingProject && project.description && (
                                <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{project.description}</p>
                            )}
                        </div>

                        {/* members + actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex -space-x-2">
                                {project.members.slice(0, 5).map((m) => (
                                    <div key={m._id} className="relative group/member">
                                        <Avatar user={m} />
                                        {isOwner && m._id !== project.owner && !isProjectDeleted && (
                                            <button
                                                onClick={() => setConfirmState({ type: 'removeMember', user: m })}
                                                className="absolute -top-1 -right-1 hidden group-hover/member:flex h-4 w-4 rounded-full bg-rose-500 text-white items-center justify-center"
                                                aria-label={`Quitar a ${m.name}`}
                                            >
                                                <CloseIcon />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {project.members.length > 5 && (
                                    <span
                                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-[#27272A] ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                                    >
                                        +{project.members.length - 5}
                                    </span>
                                )}
                            </div>

                            {isOwner && !isProjectDeleted && (
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <AddCircleIcon isDark={dark} />
                                </button>
                            )}

                            {isOwner &&
                                (!isProjectDeleted ? (
                                    <button
                                        onClick={() => setConfirmState({ type: 'status', status: 'DELETED' })}
                                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                        <DeleteIcon />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleChangeStatus('ACTIVE')}
                                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors"
                                    >
                                        <RestoreIcon />
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>

                {/* ---- lists ---- */}
                <div
                    className="flex items-start gap-4 overflow-x-auto pb-4 ui-scroll-y ui-scroll-x"
                    onDragOver={(e) => draggedListId && e.preventDefault()}
                    onDrop={(e) => {
                        if (draggedListId) {
                            e.preventDefault()
                            handleListDrop()
                        }
                    }}
                >
                    {sortedLists.map((list, listIndex) => {
                        const listTasks = tasksByList(list._id)
                        const nextList = sortedLists[listIndex + 1]
                        const isDraggingThisList = draggedListId === list._id

                        return (
                            <Fragment key={list._id}>
                                {listDragIndicator?.beforeListId === list._id && draggedListId && draggedListId !== list._id && (
                                    <InsertionBar axis="x" />
                                )}

                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        if (!draggedListId || draggedListId === list._id) return
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const before = e.clientX < rect.left + rect.width / 2
                                        setListDragIndicator({ beforeListId: before ? list._id : nextList ? nextList._id : null })
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        if (draggedListId) handleListDrop()
                                    }}
                                    className={`w-72 flex-shrink-0 rounded-2xl border flex flex-col max-h-[75vh] transition-all duration-150 ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'} ${isDraggingThisList ? 'opacity-40 scale-[0.98]' : ''}`}
                                >
                                    {/* only the header is draggable (avoids nested draggables with TaskCard) */}
                                    <div
                                        draggable={!isProjectDeleted}
                                        onDragStart={(e) => {
                                            e.stopPropagation()
                                            setDraggedListId(list._id)
                                        }}
                                        onDragEnd={cleanupListDrag}
                                        className="flex items-center justify-between px-3 pt-3 pb-2 cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span className={dark ? 'text-white' : 'text-black'}>
                                                <ListIcon />
                                            </span>
                                            <h3 className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{list.name}</h3>
                                            <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{listTasks.length}</span>
                                        </div>
                                    </div>

                                    <div
                                        className="flex-1 overflow-y-auto px-3 flex flex-col gap-2 min-h-[60px]"
                                        onDragOver={(e) => {
                                            e.preventDefault()
                                            if (draggedTaskId) setTaskDragIndicator({ listId: list._id, beforeTaskId: null })
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault()
                                            if (draggedTaskId) handleTaskDrop(list._id)
                                        }}
                                    >
                                        <AnimatePresence initial={false}>
                                            {listTasks.map((task, index) => {
                                                const nextTask = listTasks[index + 1]
                                                const showBarBefore =
                                                    taskDragIndicator?.listId === list._id &&
                                                    taskDragIndicator.beforeTaskId === task._id &&
                                                    draggedTaskId !== task._id

                                                return (
                                                    <Fragment key={task._id}>
                                                        {showBarBefore && <InsertionBar axis="y" />}
                                                        <TaskCard
                                                            task={task}
                                                            dark={dark}
                                                            members={project.members}
                                                            isAssigning={assigningTaskId === task._id}
                                                            isDragging={draggedTaskId === task._id}
                                                            onDragStart={() => setDraggedTaskId(task._id)}
                                                            onDragEnd={cleanupTaskDrag}
                                                            onSaveEdit={onSaveEditTask}
                                                            onDragOverCard={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                if (!draggedTaskId || draggedTaskId === task._id) return
                                                                const rect = e.currentTarget.getBoundingClientRect()
                                                                const before = e.clientY < rect.top + rect.height / 2
                                                                setTaskDragIndicator({
                                                                    listId: list._id,
                                                                    beforeTaskId: before ? task._id : nextTask ? nextTask._id : null,
                                                                })
                                                            }}
                                                            onDelete={() => setConfirmState({ type: 'deleteTask', task })}
                                                            onToggleAssign={() => setAssigningTaskId((cur) => (cur === task._id ? null : task._id))}
                                                            onAssignUser={(u) => handleAssign(task, u)}
                                                            onUnassignUser={(u) => handleUnassign(task, u)}
                                                        />
                                                    </Fragment>
                                                )
                                            })}
                                        </AnimatePresence>

                                        {taskDragIndicator?.listId === list._id && taskDragIndicator.beforeTaskId === null && draggedTaskId && (
                                            <InsertionBar axis="y" />
                                        )}
                                    </div>

                                    {/* add task */}
                                    <div className="p-3">
                                        {addingTaskListId === list._id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    autoFocus
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(list._id)}
                                                    placeholder="Task title"
                                                    className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleAddTask(list._id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700">
                                                        Add
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAddingTaskListId(null)
                                                            setNewTaskTitle('')
                                                        }}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            !isProjectDeleted && (
                                                <button
                                                    onClick={() => setAddingTaskListId(list._id)}
                                                    className={`flex items-center gap-1.5 text-xs font-medium w-full px-2 py-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    <AddCircleIcon isDark={dark} /> Add Task
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}

                    {listDragIndicator?.beforeListId === null && draggedListId && <InsertionBar axis="x" />}

                    {/* add list */}
                    {!isProjectDeleted && (
                        <div className="w-72 flex-shrink-0">
                            {addingListOpen ? (
                                <div className={`rounded-2xl border p-3 flex flex-col gap-2 ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'}`}>
                                    <input
                                        autoFocus
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                                        placeholder="Nombre de la lista"
                                        className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleAddList} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700">
                                            Create
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddingListOpen(false)
                                                setNewListName('')
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingListOpen(true)}
                                    className={`w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-2xl border border-dashed py-3 transition-colors ${dark ? 'border-gray-700 text-gray-500 hover:bg-gray-800/40' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                >
                                    <AddCircleIcon isDark={dark} /> Add list
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {lastActivity.length === 0 ? (
                    <p className="text-sm text-gray-400 mt-4">No recent activity</p>
                ) : (
                    lastActivity.map((event) => (
                        <ProjectEventCard key={event._id} event={event} />
                    ))
                )}
            </div>

            {/* ---- invite modal ---- */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowInviteModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Invite users</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${dark ? 'bg-[#18181B] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <SearchIcon />
                                <input
                                    autoFocus
                                    value={inviteQuery}
                                    onChange={(e) => setInviteQuery(e.target.value)}
                                    placeholder="Search by name or email"
                                    className={`w-full text-sm bg-transparent outline-none ${dark ? 'text-white' : 'text-gray-900'}`}
                                />
                            </div>

                            <div className="mt-3 flex flex-col gap-1 max-h-64 overflow-y-auto ui-scroll-y">
                                {inviteResults.length === 0 && (
                                    <p className={`text-xs px-1 py-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No users found.</p>
                                )}

                                {inviteResults.map((u) => (
                                    <div
                                        key={u._id}
                                        className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                                    >
                                        <Avatar user={u} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{u.name}</p>
                                            <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{u.email}</p>
                                        </div>
                                        <button onClick={() => handleInvite(u)} className="text-xs font-semibold text-[#2563EB] hover:underline flex-shrink-0">
                                            Invite
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- confirm dialogs ---- */}
            <ConfirmDialog
                dark={dark}
                open={confirmState?.type === 'status'}
                title="Delete project"
                message="The project will be marked as deleted. You can restore it later."
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'status' && handleChangeStatus(confirmState.status)}
            />

            <ConfirmDialog
                dark={dark}
                open={confirmState?.type === 'removeMember'}
                title="Remove from project"
                message={confirmState?.type === 'removeMember' ? `${confirmState.user.name} will lose access to this project.` : ''}
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'removeMember' && handleRemoveMember(confirmState.user)}
            />

            <ConfirmDialog
                dark={dark}
                open={confirmState?.type === 'deleteTask'}
                title="Delete task"
                message={confirmState?.type === 'deleteTask' ? `"${confirmState.task.title}" will be deleted.` : ''}
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'deleteTask' && handleDeleteTask(confirmState.task)}
            />
        </div>
    )
}

export default KanbanBoard