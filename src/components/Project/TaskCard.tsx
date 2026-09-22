import { KanbanTask, KanbanUser, TaskPriority } from "../../interfaces/projects.interfaces"
import { motion, AnimatePresence } from 'framer-motion'
import Avatar from "./Avatar"
import { AddCircleIcon, CheckIcon, DeleteIcon } from "../../utils/iconsUtils"

const priorityStyles: Record<TaskPriority, string> = {
    LOW: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    MEDIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
    HIGH: 'bg-rose-50 text-rose-700 border border-rose-200',
}

const priorityLabel: Record<TaskPriority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

const TaskCard = ({
    task,
    dark,
    members,
    isAssigning,
    onDragStart,
    onDragEnterCard,
    onDelete,
    onToggleAssign,
    onAssignUser,
    onUnassignUser,
}: {
    task: KanbanTask
    dark: boolean
    members: KanbanUser[]
    isAssigning: boolean
    onDragStart: () => void
    onDragEnterCard: () => void
    onDelete: () => void
    onToggleAssign: () => void
    onAssignUser: (u: KanbanUser) => void
    onUnassignUser: (u: KanbanUser) => void
}) => {
    const assignedIds = new Set(task.assignedUsers.map((u) => u._id))

    return (
        <motion.div
            layout
            layoutId={task._id}
            draggable
            onDragStart={onDragStart}
            onDragEnter={onDragEnterCard}
            onDragOver={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`group/card relative rounded-xl border p-3 cursor-grab active:cursor-grabbing ${dark
                    ? 'bg-[#1F1F22] border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-medium leading-snug ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                    {task.title}
                </p>
                <button
                    onClick={onDelete}
                    aria-label="Eliminar tarea"
                    className="opacity-0 group-hover/card:opacity-100 transition-opacity text-gray-400 hover:text-rose-500 flex-shrink-0"
                >
                    <DeleteIcon />
                </button>
            </div>

            {task.description && (
                <p className={`mt-1 text-xs line-clamp-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {task.description}
                </p>
            )}

            <div className="mt-2.5 flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
                    {priorityLabel[task.priority]}
                </span>

                <div className="relative">
                    <button
                        onClick={onToggleAssign}
                        className="flex items-center -space-x-1.5"
                        aria-label="Asignar usuarios"
                    >
                        {task.assignedUsers.slice(0, 3).map((u) => (
                            <Avatar key={u._id} user={u} size={6} />
                        ))}
                        {task.assignedUsers.length === 0 && (
                            <span
                                className={`h-6 w-6 rounded-full border border-dashed flex items-center justify-center ${dark ? 'border-gray-700 text-gray-600' : 'border-gray-300 text-gray-400'
                                    }`}
                            >
                                <AddCircleIcon isDark={dark}/>
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isAssigning && (
                            <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute right-0 z-20 mt-2 w-56 rounded-xl border p-1.5 shadow-lg ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                                    }`}
                            >
                                <p className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Project Members
                                </p>
                                {members.length === 0 && (
                                    <p className={`px-2 py-1.5 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Invita usuarios para poder asignarlos.
                                    </p>
                                )}
                                {members.map((m) => {
                                    const assigned = assignedIds.has(m._id)
                                    return (
                                        <button
                                            key={m._id}
                                            onClick={() => (assigned ? onUnassignUser(m) : onAssignUser(m))}
                                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <Avatar user={m} size={5} />
                                            <span className={`flex-1 truncate ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{m.name}</span>
                                            {assigned && <CheckIcon />}
                                        </button>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

export default TaskCard;