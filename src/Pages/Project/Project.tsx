import { Fragment, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

/**
 * services
 */
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
import { KanbanList, KanbanProject, KanbanTask, KanbanUser, ProjectStatus } from '../../interfaces/projects.interfaces'
import TaskCard from '../../components/Project/TaskCard'
import Avatar from '../../components/Project/Avatar'
import { AddCircleIcon, CloseIcon, DeleteIcon, ListIcon, PenIcon, RestoreIcon, SearchIcon } from '../../utils/iconsUtils'
import Spinner from '../../components/Spinner/Spinner'
import Sidebar from '../../components/Sidebar/Sidebar'

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

// thin bar shown between/around cards or columns to preview where the
// dragged item will land
const InsertionBar = ({ axis }: { axis: 'x' | 'y' }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={axis === 'y' ? 'h-1 rounded-full bg-[#2563EB] mx-1' : 'w-1 self-stretch rounded-full bg-[#2563EB] flex-shrink-0'}
    />
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

    // data for kanban
    const [project, setProject] = useState<KanbanProject | null>(null)
    const [lists, setLists] = useState<KanbanList[]>([])
    const [tasks, setTasks] = useState<KanbanTask[]>([])

    // edit project infp
    const [editingProject, setEditingProject] = useState(false)
    const [projectForm, setProjectForm] = useState({ name: '', description: '' })

    // to show ui to add new list
    const [addingListOpen, setAddingListOpen] = useState(false)
    const [newListName, setNewListName] = useState('')

    // to add a new list
    const [addingTaskListId, setAddingTaskListId] = useState<string | null>(null)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    // to assign user in task
    const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null)

    // to show modal
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteQuery, setInviteQuery] = useState('') // query
    const [inviteResults, setInviteResults] = useState<KanbanUser[]>([]) // results info

    // types to show modals
    const [confirmState, setConfirmState] = useState<ConfirmState>(null)

    // drag & drop state 
    // tasks: identified by id, never by a raw index (that's what caused the
    // off-by-one bug when reordering/moving across lists)
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
    const [taskDragIndicator, setTaskDragIndicator] = useState<{ listId: string; beforeTaskId: string | null } | null>(
        null
    )
    // lists: same id-based approach
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

    // load project info
    useEffect(() => {
        const getProject = async () => {
            try {
                const { data } = await clientAuthAxios.get(`/project/get-project/${id}`)
                const board = data.data
                setProject(board.project)
                setLists(board.lists)
                setTasks(board.tasks)
                setProjectForm({ name: board.project.name, description: board.project.description })
            } catch (error: any) {
                showConfirmSwal({
                    message: error.response?.data?.message || 'No se pudo cargar el proyecto',
                    status: 'error',
                    confirmButton: true,
                    cancelButton: false,
                })
            }
        }
        getProject()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // activate when user is search to invite someone
    useEffect(() => {
        if (!showInviteModal || !project) return
        const run = async () => {
            try {

                // search users
                const results = await searchUsers(inviteQuery.trim())

                // getids
                const memberIds = new Set(project.members.map((m) => m._id))

                // format to not invite again users that are in our project
                setInviteResults(results.filter((u) => !memberIds.has(u._id)))
            } catch {
                setInviteResults([])
            }
        }
        run()
    }, [inviteQuery, showInviteModal]);

    const isOwner2 = userAuth.userId === project?.owner;
    const isOwner = project ? project.owner === currentUser._id : false
    const isProjectDeleted = project?.status === 'DELETED'

    // update project info
    const handleSaveProject = async () => {
        if (!project) return
        try {
            await updateProject(project._id, projectForm);
            setProject({ ...project, ...projectForm });

            // close edit 
            setEditingProject(false)
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'There was an error to update project.', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    // delete or update status project
    const handleChangeStatus = async (status: ProjectStatus) => {
        if (!project) return
        try {
            await updateProjectStatus(project._id, status)
            setProject({ ...project, status })
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'There was an error to update status project.', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    // add new list
    const handleAddList = async () => {
        if (!project || !newListName.trim()) return
        try {

            // list response from backend
            const created = await createList(project._id, newListName.trim(), lists.length)

            // update 
            setLists((prev) =>
                [...prev, // save last state
                {
                    ...created, // set new task
                    order: prev.length // set order to new task in front we dont use position
                }
                ]);

            // set null and false to not show ui 
            setNewListName('')
            setAddingListOpen(false)
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'There was an error to add new list.', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    // order list in base to position
    const sortedLists = [...lists].sort((a, b) => a.order - b.order)

    // update list position and save to db TODO
    const handleListDrop = () => {
        if (!project || !draggedListId) {
            cleanupListDrag()
            return
        }
        const indicator = listDragIndicator ?? { beforeListId: null }
        setLists((prev) => {

            // order actual lists
            const sorted = [...prev].sort((a, b) => a.order - b.order)
            const fromIndex = sorted.findIndex((l) => l._id === draggedListId)
            if (fromIndex === -1) return prev

            // extract new list position
            const [moved] = sorted.splice(fromIndex, 1);
            const rawTarget = indicator.beforeListId ? sorted.findIndex((l) => l._id === indicator.beforeListId) : -1
            const targetIndex = rawTarget === -1 ? sorted.length : rawTarget;
            sorted.splice(targetIndex, 0, moved)

            // reorder to change view and send data to backend
            const reindexed = sorted.map((l, i) => ({ ...l, order: i }))
            reorderLists(project._id, reindexed)
            return reindexed
        })
        cleanupListDrag()
    }

    // filter tasks by list and order
    const tasksByList = (listId: string) => // need list id to filter
        tasks.filter((t) => t.listId === listId).sort((a, b) => a.order - b.order)

    // add new task
    const handleAddTask = async (listId: string) => {
        if (!project || !newTaskTitle.trim()) return
        try {
            const created = await createTask(listId, {
                project: project._id,
                title: newTaskTitle.trim(),
                description: '',
                position: tasksByList(listId).length,
                createdBy: currentUser._id,
            })

            // add to task our response
            setTasks((prev) =>
                [
                    ...prev,
                    {
                        ...created, // set last state
                        listId, // set list
                        assignedUsers: [], // set a empy array 
                        // get tasks by list and then set length from that list
                        order: tasksByList(listId).length // set order based in length but only check it list id
                    }
                ]);
            setNewTaskTitle('')
            setAddingTaskListId(null)
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo crear la tarea', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    // delete task
    const handleDeleteTask = async (task: KanbanTask) => {
        try {
            await deleteTask(task._id)

            // update state
            setTasks((prev) =>
                prev
                    .filter((t) => t._id !== task._id) // first we filter to get task
                    .map((t) => // reorder this map
                    (t.listId === task.listId && t.order > task.order // check task in the same list and check position
                        ? { ...t, order: t.order - 1 } // reorder task with order > order deleted
                        : t)) // no order
            )

        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo eliminar la tarea', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    const performMoveTask = (taskId: string, fromListId: string, toListId: string, toIndex: number) => {

        setTasks((prev) => {
            const movingTask = prev.find((t) => t._id === taskId)
            if (!movingTask) return prev

            if (fromListId === toListId) {
                const listTasks = prev.filter((t) => t.listId === fromListId && t._id !== taskId).sort((a, b) => a.order - b.order)
                const clamped = Math.min(toIndex, listTasks.length)
                listTasks.splice(clamped, 0, movingTask)
                const reindexed = listTasks.map((t, i) => ({ ...t, order: i }))
                const updated = reindexed.find((t) => t._id === taskId)!
                moveTask(taskId, { title: updated.title, description: updated.description, position: clamped, list: toListId })
                return [...prev.filter((t) => t.listId !== fromListId), ...reindexed]
            }

            const fromTasks = prev
                .filter((t) => t.listId === fromListId && t._id !== taskId)
                .sort((a, b) => a.order - b.order)
                .map((t, i) => ({ ...t, order: i }))

            const toTasks = prev.filter((t) => t.listId === toListId).sort((a, b) => a.order - b.order)
            const clamped = Math.min(toIndex, toTasks.length)
            const movedTask = { ...movingTask, listId: toListId }
            toTasks.splice(clamped, 0, movedTask)
            const reindexedTo = toTasks.map((t, i) => ({ ...t, order: i }))

            moveTask(taskId, { title: movedTask.title, description: movedTask.description, position: clamped, list: toListId })

            return [...prev.filter((t) => t.listId !== fromListId && t.listId !== toListId), ...fromTasks, ...reindexedTo]
        })
    }

    const handleTaskDrop = (listId: string) => {
        if (!draggedTaskId) return
        const dragged = tasks.find((t) => t._id === draggedTaskId)
        if (!dragged) {
            cleanupTaskDrag()
            return
        }
        const indicator = taskDragIndicator && taskDragIndicator.listId === listId ? taskDragIndicator : { listId, beforeTaskId: null }
        const siblings = tasks.filter((t) => t.listId === listId && t._id !== dragged._id).sort((a, b) => a.order - b.order)
        const idx = indicator.beforeTaskId ? siblings.findIndex((t) => t._id === indicator.beforeTaskId) : -1
        const finalIndex = idx === -1 ? siblings.length : idx
        performMoveTask(dragged._id, dragged.listId, listId, finalIndex)
        cleanupTaskDrag()
    }

    // assing user to task
    const handleAssign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await assignUserToTask(task._id, user._id)
            setTasks(
                (prev) => prev.map(
                    (t) => (
                        t._id === task._id // check if is task to update
                        ? { ...t, assignedUsers: [user] } // add user in ui
                        : t // send same task, we dont do changes
                    ))
                )
            setAssigningTaskId(null)
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo asignar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }

    // unassign user
    const handleUnassign = async (task: KanbanTask, user: KanbanUser) => {
        try {
            await unassignUserFromTask(task._id, user._id)

            setTasks(
                (prev) => prev.map(
                    (t) => (
                        t._id === task._id // find task to update
                        ? { ...t, assignedUsers: [] } // quit user from state
                        : t
                    ))
                )
            setAssigningTaskId(null)
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo quitar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }


    // update task data
    const onSaveEditTask = async (
        taskId: string,
        title: string,
        description: string
    ): Promise<KanbanTask> => {

        const updatedTask = await updateTask(taskId, { title, description });

        // update only task info
        setTasks(prev =>
            prev.map(task =>
                task._id === updatedTask._id
                    ? {
                        // update info
                        ...task,
                        title: updatedTask.title,
                        description: updatedTask.description
                    }
                    : task
            )
        );

        return updatedTask;
    };

    // invite and set new member
    const handleInvite = async (user: KanbanUser) => {
        if (!project) return
        try {

            // set info in db
            await inviteUserToProject(project._id, user._id)

            setProject(
                {
                    ...project,
                    members: [...project.members, user] // new member
                }
            )

            setInviteResults((prev) => prev.filter((u) => u._id !== user._id))
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo invitar al usuario', status: 'error', confirmButton: true, cancelButton: false })
        }
    }


    // remove member
    const handleRemoveMember = async (user: KanbanUser) => {
        if (!project) return
        try {

            // set info in backend
            await removeUserFromProject(project._id, user._id)

            setProject(
                { 
                    ...project, // copy last state
                    members: project.members.filter((m) => m._id !== user._id) // set new array members and filter
                }
            );
        } catch (error: any) {
            showConfirmSwal({ message: error.response?.data?.message || 'No se pudo quitar al usuario del proyecto', status: 'error', confirmButton: true, cancelButton: false })
        } finally {
            setConfirmState(null)
        }
    }

    if (!project) {
        return <Spinner />
    }

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

                            {/* to show editing project info ui */}
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

                                // show normal ui
                                <div className="flex items-center gap-2">
                                    <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h1>
                                    {isOwner2 && !isProjectDeleted && ( // only if is owner and project is not deleted
                                        <button onClick={() => setEditingProject(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Editar proyecto">
                                            <PenIcon isDark={dark} />
                                        </button>
                                    )}
                                </div>
                            )}
                            {!editingProject && project.description && <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{project.description}</p>}
                        </div>

                        {/* status + members + actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex -space-x-2">
                                {project.members.slice(0, 5).map((m) => (
                                    <div key={m._id} className="relative group/member">
                                        <Avatar user={m} />

                                        {/* button to remove an user from project */}
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
                                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-white dark:ring-[#27272A] ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        +{project.members.length - 5}
                                    </span>
                                )}
                            </div>


                            {/* show modal to invite a new user */}
                            {isOwner && !isProjectDeleted && (
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
                                    {!isProjectDeleted ? (
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

                {/* print lists */}
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
                    {/* bucle to print lists */}
                    {sortedLists.map((list, listIndex) => {

                        // by each list we get task order by position
                        const listTasks = tasksByList(list._id)

                        // get next list
                        const nextList = sortedLists[listIndex + 1]

                        // 
                        const isDraggingThisList = draggedListId === list._id

                        return (
                            <Fragment key={list._id}>
                                {listDragIndicator?.beforeListId === list._id && draggedListId && draggedListId !== list._id && (
                                    <InsertionBar axis="x" />
                                )}

                                <div
                                    // NOT draggable here anymore — dragging the whole column was
                                    // competing with dragging the single TaskCard inside it
                                    // (nested draggables are ambiguous), which is exactly what
                                    // caused the list itself to get reordered when it only had
                                    // one task. Only the header handle below is draggable now.
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
                                    className={`w-72 flex-shrink-0 rounded-2xl border flex flex-col max-h-[75vh] transition-all duration-150 ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'
                                        } ${isDraggingThisList ? 'opacity-40 scale-[0.98]' : ''}`}
                                >
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
                                            <span className={`${dark ? 'text-white' : 'text-black'}`}>
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

                                            {/* print tasks  */}
                                            {listTasks.map((task, index) => {

                                                // get next task
                                                const nextTask = listTasks[index + 1];

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
                                                            onToggleAssign={() => setAssigningTaskId((id2) => (id2 === task._id ? null : task._id))}
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

                                    {/* to add a new task */}
                                    <div className="p-3">
                                        {addingTaskListId === list._id ? ( // to show it only in a one list not all
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    autoFocus
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask(list._id)}
                                                    placeholder="Task title"
                                                    className={`text-sm rounded-lg px-2.5 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                                        }`}
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
                                                    className={`flex items-center gap-1.5 text-xs font-medium w-full px-2 py-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
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
                    {!isProjectDeleted && ( // only if project is not deleted
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

            {/* invite modal  */}
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
                                <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    Invite users
                                </h3>

                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${dark ? 'bg-[#18181B] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <SearchIcon />
                                {/* search users */}
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
                                    <p className={`text-xs px-1 py-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        No users found.
                                    </p>
                                )}

                                {/* show results from backend*/}
                                {inviteResults.map((u) => (
                                    <div
                                        key={u._id}
                                        className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                                    >
                                        <Avatar user={u} />

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                                                {u.name}
                                            </p>

                                            <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {u.email}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleInvite(u)} // invite user
                                            className="text-xs font-semibold text-[#2563EB] hover:underline flex-shrink-0"
                                        >
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