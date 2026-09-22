import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
/*import {
  Plus,
  X,
  Trash2,
  Search,
  UserPlus,
  GripVertical,
  Pencil,
  Check,
  UserMinus,
  Archive,
  RotateCcw,
} from 'lucide-react' */

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import {
    buildFakeBoard,
    updateProject,
    updateProjectStatus,
    createList,
    reorderLists,
    createTask,
    moveTask,
    deleteTask,
    searchUsers,
    searchProjectMembers,
    inviteUserToProject,
    removeUserFromProject,
    assignUserToTask,
    unassignUserFromTask,
} from '../../utils/projectUtils'
import { KanbanList, KanbanProject, KanbanTask, KanbanUser, ProjectStatus } from '../../interfaces/projects.interfaces'
import TaskCard from '../../components/Project/TaskCard'
import Avatar from '../../components/Project/Avatar'
import { AddCircleIcon, CloseIcon, DeleteIcon, ListIcon, PenIcon, RestoreIcon, SearchIcon } from '../../utils/iconsUtils'


const ConfirmDialog = ({
    open,
    title,
    message,
    danger,
    dark,
    onConfirm,
    onCancel,
}: {
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
                    className={`w-full max-w-sm rounded-2xl border p-5 shadow-xl ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                        }`}
                >
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <p className={`mt-1.5 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-lg text-white transition-colors ${danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#2563EB] hover:bg-blue-700'
                                }`}
                        >
                            Confirmar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)

type ConfirmState =
    | { type: 'status'; status: ProjectStatus }
    | { type: 'removeMember'; user: KanbanUser }
    | { type: 'deleteTask'; task: KanbanTask }
    | null


// ----------------------------
// board
// ----------------------------
export const KanbanBoard = () => {
    const { userAuth } = userUserAuthContext()
    const { showConfirmSwal } = useSwal()
    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal

    const currentUser: KanbanUser = useMemo(
        () => ({
            _id: userAuth?.userId ?? 'me',
            name: (userAuth as any)?.name || 'Tú',
            email: (userAuth as any)?.email || '',
            profilePicture: (userAuth as any)?.profilePicture,
        }),
        [userAuth]
    )

    const [project, setProject] = useState<KanbanProject | null>(null)
    const [lists, setLists] = useState<KanbanList[]>([])
    const [tasks, setTasks] = useState<KanbanTask[]>([])

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

    const [confirmState, setConfirmState] = useState<ConfirmState>(null)

    const draggedTaskRef = { current: null as { taskId: string; fromListId: string } | null }
    const [draggedListId, setDraggedListId] = useState<string | null>(null)
    const [dropTarget, setDropTarget] = useState<{ listId: string; index: number } | null>(null)
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

    // ---- initial load (fake) 
    useEffect(() => {
        const board = buildFakeBoard(currentUser)
        setProject(board.project)
        setLists(board.lists)
        setTasks(board.tasks)
        setProjectForm({ name: board.project.name, description: board.project.description })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isOwner = project ? project.owner._id === currentUser._id : false
    const isDeleted = project?.status === 'DELETED'

    // ---- project --------
    const handleSaveProject = async () => {
        if (!project) return
        try {
            await updateProject(project._id, projectForm)
            setProject({ ...project, ...projectForm })
            setEditingProject(false)
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo actualizar el proyecto', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    const handleChangeStatus = async (status: ProjectStatus) => {
        if (!project) return
        try {
            await updateProjectStatus(project._id, status)
            setProject({ ...project, status })
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo actualizar el estado del proyecto', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    // ---- lists ------------
    const handleAddList = async () => {
        if (!project || !newListName.trim()) return
        try {
            const created = await createList(project._id, newListName.trim())
            setLists((prev) => [...prev, { ...created, order: prev.length }])
            setNewListName('')
            setAddingListOpen(false)
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo crear la lista', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    const handleListDrop = (targetListId: string) => {
        if (!project || !draggedListId || draggedListId === targetListId) {
            setDraggedListId(null)
            return
        }
        setLists((prev) => {
            const sorted = [...prev].sort((a, b) => a.order - b.order)
            const fromIndex = sorted.findIndex((l) => l._id === draggedListId)
            const toIndex = sorted.findIndex((l) => l._id === targetListId)
            const [moved] = sorted.splice(fromIndex, 1)
            sorted.splice(toIndex, 0, moved)
            const reindexed = sorted.map((l, i) => ({ ...l, order: i }))
            reorderLists(project._id, reindexed.map((l) => l._id))
            return reindexed
        })
        setDraggedListId(null)
    }

    // ---- tasks --------------
    const tasksByList = (listId: string) =>
        tasks.filter((t) => t.listId === listId).sort((a, b) => a.order - b.order)

    const handleAddTask = async (listId: string) => {
        if (!newTaskTitle.trim()) return
        try {
            const created = await createTask(listId, { title: newTaskTitle.trim(), priority: 'MEDIUM' })
            setTasks((prev) => [...prev, { ...created, order: tasksByList(listId).length }])
            setNewTaskTitle('')
            setAddingTaskListId(null)
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo crear la tarea', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    const handleDeleteTask = async (task: KanbanTask) => {
        try {
            await deleteTask(task._id)
            setTasks((prev) =>
                prev
                    .filter((t) => t._id !== task._id)
                    .map((t) =>
                        t.listId === task.listId && t.order > task.order ? { ...t, order: t.order - 1 } : t
                    )
            )
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo eliminar la tarea', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    const performMoveTask = (taskId: string, fromListId: string, toListId: string, toIndex: number) => {
        setTasks((prev) => {
            const movingTask = prev.find((t) => t._id === taskId)
            if (!movingTask) return prev

            if (fromListId === toListId) {
                const listTasks = prev
                    .filter((t) => t.listId === fromListId && t._id !== taskId)
                    .sort((a, b) => a.order - b.order)
                const clamped = Math.min(toIndex, listTasks.length)
                listTasks.splice(clamped, 0, movingTask)
                const reindexed = listTasks.map((t, i) => ({ ...t, order: i }))
                moveTask(taskId, { fromListId, toListId, toOrder: clamped })
                return [...prev.filter((t) => t.listId !== fromListId), ...reindexed]
            }

            const fromTasks = prev
                .filter((t) => t.listId === fromListId && t._id !== taskId)
                .sort((a, b) => a.order - b.order)
                .map((t, i) => ({ ...t, order: i }))

            const toTasks = prev
                .filter((t) => t.listId === toListId)
                .sort((a, b) => a.order - b.order)
            const clamped = Math.min(toIndex, toTasks.length)
            toTasks.splice(clamped, 0, { ...movingTask, listId: toListId })
            const reindexedTo = toTasks.map((t, i) => ({ ...t, order: i }))

            moveTask(taskId, { fromListId, toListId, toOrder: clamped })

            return [
                ...prev.filter((t) => t.listId !== fromListId && t.listId !== toListId),
                ...fromTasks,
                ...reindexedTo,
            ]
        })
    }

    const handleTaskDrop = (listId: string) => {
        if (!draggedTaskId) return
        const dragged = tasks.find((t) => t._id === draggedTaskId)
        if (!dragged) return
        const targetIndex = dropTarget && dropTarget.listId === listId ? dropTarget.index : tasksByList(listId).length
        performMoveTask(dragged._id, dragged.listId, listId, targetIndex)
        setDraggedTaskId(null)
        setDropTarget(null)
    }

    // ---- assignment -----
    const handleAssign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await assignUserToTask(task._id, user._id)
            setTasks((prev) =>
                prev.map((t) => (t._id === task._id ? { ...t, assignedUsers: [...t.assignedUsers, user] } : t))
            )
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo asignar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    const handleUnassign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await unassignUserFromTask(task._id, user._id)
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, assignedUsers: t.assignedUsers.filter((u) => u._id !== user._id) } : t
                )
            )
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo quitar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    // ---- members / invite -
    useEffect(() => {
        if (!showInviteModal || !project) return
        const run = async () => {
            const results = inviteQuery.trim()
                ? await searchUsers(inviteQuery.trim())
                : await searchUsers('')
            const memberIds = new Set(project.members.map((m) => m._id))
            setInviteResults(results.filter((u) => !memberIds.has(u._id)))
        }
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inviteQuery, showInviteModal])

    const handleInvite = async (user: KanbanUser) => {
        if (!project) return
        try {
            await inviteUserToProject(project._id, user._id)
            setProject({ ...project, members: [...project.members, user] })
            setInviteResults((prev) => prev.filter((u) => u._id !== user._id))
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo invitar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    const handleRemoveMember = async (user: KanbanUser) => {
        if (!project) return
        try {
            await removeUserFromProject(project._id, user._id)
            setProject({ ...project, members: project.members.filter((m) => m._id !== user._id) })
        } catch (error: any) {
            showConfirmSwal({ message: 'No se pudo quitar al usuario del proyecto', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    if (!project) {
        return (
            <div className={`p-10 text-center text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Cargando tablero...
            </div>
        )
    }

    return (
        <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* ---- project header ---- */}
                <div
                    className={`rounded-2xl border p-5 mb-6 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                        }`}
                >
                    {isDeleted && (
                        <div className="mb-3 px-3 py-2 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            Este proyecto fue eliminado. Puedes restaurarlo para seguir trabajando en él.
                        </div>
                    )}

                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-[240px]">
                            {editingProject ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
                                        className={`text-lg font-bold rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                    />
                                    <textarea
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                                        rows={2}
                                        className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border resize-none ${dark ? 'bg-[#18181B] border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-600'
                                            }`}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveProject}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProjectForm({ name: project.name, description: project.description })
                                                setEditingProject(false)
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h1>
                                    {isOwner && !isDeleted && (
                                        <button
                                            onClick={() => setEditingProject(true)}
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

                        {/* status + members + actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex -space-x-2">
                                {project.members.slice(0, 5).map((m) => (
                                    <div key={m._id} className="relative group/member">
                                        <Avatar user={m} />
                                        {isOwner && m._id !== project.owner._id && !isDeleted && (
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
                                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-[#27272A] ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        +{project.members.length - 5}
                                    </span>
                                )}
                            </div>

                            {isOwner && !isDeleted && (
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <AddCircleIcon isDark={dark} />
                                </button>
                            )}

                            {isOwner && (
                                <>
                                    {!isDeleted ? (
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
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---- lists ---- */}
                <div className="flex items-start gap-4 overflow-x-auto pb-4 ui-scroll-y ui-scroll-x">
                    {lists
                        .sort((a, b) => a.order - b.order)
                        .map((list) => {
                            const listTasks = tasksByList(list._id)
                            return (
                                <div
                                    key={list._id}
                                    draggable={!isDeleted}
                                    onDragStart={() => setDraggedListId(list._id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleListDrop(list._id)}
                                    className={`w-72 flex-shrink-0 rounded-2xl border flex flex-col max-h-[75vh] ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between px-3 pt-3 pb-2 cursor-grab active:cursor-grabbing">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`${dark ? 'text-white' : 'text-black'} `}>
                                                <ListIcon />
                                            </span>
                                            <h3 className={`text-sm font-semibold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{list.name}</h3>
                                            <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{listTasks.length}</span>
                                        </div>
                                    </div>

                                    <div
                                        className="flex-1 overflow-y-auto px-3 flex flex-col gap-2 min-h-[60px]"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => handleTaskDrop(list._id)}
                                    >
                                        <AnimatePresence initial={false}>
                                            {listTasks.map((task, index) => (
                                                <TaskCard
                                                    key={task._id}
                                                    task={task}
                                                    dark={dark}
                                                    members={project.members}
                                                    isAssigning={assigningTaskId === task._id}
                                                    onDragStart={() => setDraggedTaskId(task._id)}
                                                    onDragEnterCard={() => setDropTarget({ listId: list._id, index })}
                                                    onDelete={() => setConfirmState({ type: 'deleteTask', task })}
                                                    onToggleAssign={() => setAssigningTaskId((id) => (id === task._id ? null : task._id))}
                                                    onAssignUser={(u) => handleAssign(task, u)}
                                                    onUnassignUser={(u) => handleUnassign(task, u)}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <div className="p-3">
                                        {addingTaskListId === list._id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    autoFocus
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(list._id)}
                                                    placeholder="Título de la tarea"
                                                    className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                                        }`}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAddTask(list._id)}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700"
                                                    >
                                                        Agregar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAddingTaskListId(null)
                                                            setNewTaskTitle('')
                                                        }}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            !isDeleted && (
                                                <button
                                                    onClick={() => setAddingTaskListId(list._id)}
                                                    className={`flex items-center gap-1.5 text-xs font-medium w-full px-2 py-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <AddCircleIcon isDark={dark} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                    {/* add list */}
                    {!isDeleted && (
                        <div className="w-72 flex-shrink-0">
                            {addingListOpen ? (
                                <div className={`rounded-2xl border p-3 flex flex-col gap-2 ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'}`}>
                                    <input
                                        autoFocus
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                                        placeholder="Nombre de la lista"
                                        className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddList}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700"
                                        >
                                            Create
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddingListOpen(false)
                                                setNewListName('')
                                            }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingListOpen(true)}
                                    className={`w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-2xl border border-dashed py-3 transition-colors ${dark ? 'border-gray-700 text-gray-500 hover:bg-gray-800/40' : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <AddCircleIcon isDark={dark} /> Add list
                                </button>
                            )}
                        </div>
                    )}
                </div>
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
                            className={`w-full max-w-md rounded-2xl border p-5 shadow-xl ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Invitar usuarios</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <CloseIcon />
                                </button>
                            </div>

                            <div
                                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${dark ? 'bg-[#18181B] border-gray-700' : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <SearchIcon />
                                <input
                                    autoFocus
                                    value={inviteQuery}
                                    onChange={(e) => setInviteQuery(e.target.value)}
                                    placeholder="Buscar por nombre o correo"
                                    className={`w-full text-sm bg-transparent outline-none ${dark ? 'text-white' : 'text-gray-900'}`}
                                />
                            </div>

                            <div className="mt-3 flex flex-col gap-1 max-h-64 overflow-y-auto">
                                {inviteResults.length === 0 && (
                                    <p className={`text-xs px-1 py-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        No se encontraron usuarios.
                                    </p>
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
                                        <button
                                            onClick={() => handleInvite(u)}
                                            className="text-xs font-semibold text-[#2563EB] hover:underline flex-shrink-0"
                                        >
                                            Invitar
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
                title="Eliminar proyecto"
                message="El proyecto pasará a estado eliminado. Podrás restaurarlo más adelante."
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'status' && handleChangeStatus(confirmState.status)}
            />
            <ConfirmDialog
                dark={dark}
                open={confirmState?.type === 'removeMember'}
                title="Quitar del proyecto"
                message={confirmState?.type === 'removeMember' ? `${confirmState.user.name} perderá acceso a este proyecto.` : ''}
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'removeMember' && handleRemoveMember(confirmState.user)}
            />
            <ConfirmDialog
                dark={dark}
                open={confirmState?.type === 'deleteTask'}
                title="Eliminar tarea"
                message={confirmState?.type === 'deleteTask' ? `Se eliminará "${confirmState.task.title}".` : ''}
                danger
                onCancel={() => setConfirmState(null)}
                onConfirm={() => confirmState?.type === 'deleteTask' && handleDeleteTask(confirmState.task)}
            />
        </div>
    )
}

export default KanbanBoard