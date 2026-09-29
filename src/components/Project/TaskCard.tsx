import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Avatar from './Avatar'
import { KanbanTask, KanbanUser } from '../../interfaces/projects.interfaces'
import { AddCircleIcon, CheckIcon, TrashIcon, PenIcon } from '../../utils/iconsUtils'

interface TaskCardProps {
    task: KanbanTask
    dark: boolean
    members: KanbanUser[]
    isAssigning: boolean
    isDragging: boolean
    onDragStart: () => void
    onDragEnd: () => void
    onDragOverCard: (e: React.DragEvent<HTMLDivElement>) => void
    onDelete: () => void
    onToggleAssign: () => void
    onAssignUser: (u: KanbanUser) => void
    onUnassignUser: (u: KanbanUser) => void
    onSaveEdit: (task: string, title: string, description: string) => Promise<KanbanTask> | KanbanTask;
}

// task.assignedTo is a single user on the backend, so `assignedUsers` here
// only ever holds 0 or 1 items; assigning someone new replaces the previous one
const TaskCard = ({
    task,
    dark,
    members,
    isAssigning,
    isDragging,
    onDragStart,
    onDragEnd,
    onDragOverCard,
    onDelete,
    onToggleAssign,
    onAssignUser,
    onUnassignUser,
    onSaveEdit,
}: TaskCardProps) => {

    const assignedId = task.assignedUsers?.[0]?._id

    // to edit task
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescription] = useState(task.description || '')
    const [saving, setSaving] = useState(false)

    const startEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setEditTitle(task.title)
        setEditDescription(task.description || '')
        setIsEditing(true)
    }

    const cancelEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setIsEditing(false)
    }

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!editTitle.trim() || saving) return
        setSaving(true)
        try {
            await onSaveEdit(task._id, editTitle.trim(), editDescription.trim())
            setIsEditing(false)
        } catch {
            // dont do anything
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div
            layout
            draggable={!isEditing}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOverCard}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: isDragging ? 0.97 : 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`group/card relative rounded-xl border p-3 ${isEditing ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${isDragging ? 'ring-2 ring-[#2563EB]/50' : ''
                } ${dark
                    ? 'bg-[#1F1F22] border-gray-800 hover:border-gray-700'
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
        >
            {isEditing ? (
                <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Task title"
                        className={`text-sm font-medium rounded-lg px-2 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        placeholder="Description"
                        className={`text-xs rounded-lg px-2 py-1.5 outline-none border resize-none ${dark ? 'bg-[#18181B] border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                    />
                    <div className="flex gap-2 mt-0.5">
                        <button
                            onClick={handleSave}
                            disabled={saving || !editTitle.trim()}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                'Save'
                            )}
                        </button>
                        <button
                            onClick={cancelEdit}
                            disabled={saving}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg disabled:opacity-50 ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium leading-snug ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                            {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={startEdit} aria-label="Editar tarea" className="text-gray-400 hover:text-[#2563EB]">
                                <PenIcon isDark={dark} />
                            </button>
                            <button onClick={onDelete} aria-label="Eliminar tarea" className="text-gray-400 hover:text-rose-500">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className={`mt-1 text-xs line-clamp-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {task.description}
                        </p>
                    )}
                </>
            )}

            <div className="mt-2.5 flex items-center justify-end">
                <div className="relative">
                    <button onClick={onToggleAssign} className="flex items-center" aria-label="Asignar usuario">
                        {task.assignedUsers?.length ? (
                            <Avatar user={task.assignedUsers[0]} />
                        ) : (
                            <span
                                className={`h-6 w-6 rounded-full border border-dashed flex items-center justify-center ${dark ? 'border-gray-700 text-gray-600' : 'border-gray-300 text-gray-400'
                                    }`}
                            >
                                <AddCircleIcon size={12} />
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
                                <p
                                    className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'
                                        }`}
                                >
                                    Miembros del proyecto
                                </p>
                                {members.length === 0 && (
                                    <p className={`px-2 py-1.5 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Invita usuarios para poder asignarlos.
                                    </p>
                                )}
                                {members.map((m) => {
                                    const assigned = assignedId === m._id
                                    return (
                                        <button
                                            key={m._id}
                                            onClick={() => {
                                                assigned ? onUnassignUser(m) : onAssignUser(m);
                                            }}
                                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <Avatar user={m} />
                                            <span className={`flex-1 truncate ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{m.name}</span>
                                            {assigned && <CheckIcon size={14} color="#22C55E" />}
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

export default TaskCard