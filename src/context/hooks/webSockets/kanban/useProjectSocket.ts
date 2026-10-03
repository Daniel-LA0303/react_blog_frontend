// hooks/useProjectSocket.ts
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../../../SocketContext'
import { useKanbanStore } from './useKanbanStore'
import { ProjectEventI } from '../../../../components/Project/ProjectEventCard'

export const useProjectSocket = (
  projectId: string | undefined, 
  reloadBoard: () => Promise<void>,
  onActivity?: (event: ProjectEventI) => void
) => {
  const { socket } = useSocketContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket || !projectId) return
    const st = () => useKanbanStore.getState()

    const join = () =>
      socket.emit('project:join', projectId, (res: { ok: boolean }) => {
        if (!res?.ok) return navigate('/')
        reloadBoard() // al (re)conectar, resincroniza lo que te perdiste
      })

    join()
    socket.on('connect', join) // reconexión

    socket.on('project:updated', (p) => st().patchProject(p))
    socket.on('project:status', (p) => st().patchProject(p))
    socket.on('member:added', (u) => st().addMember(u))
    socket.on('member:removed', ({ userId }) => st().removeMember(userId))
    socket.on('project:kicked', () => navigate('/'))

    socket.on('list:created', (l) => st().addList(l))
    socket.on('lists:reordered', (items) => st().applyListOrder(items))

    socket.on('task:created', (t) => st().addTask(t))
    socket.on('task:updated', ({ _id, ...rest }) => st().patchTask(_id, rest))
    socket.on('task:moved', ({ taskId, toListId, toIndex }) => st().moveTask(taskId, toListId, toIndex))
    socket.on('task:deleted', ({ taskId }) => st().removeTask(taskId))
    socket.on('task:assigned', ({ taskId, user }) => st().setAssignee(taskId, user))
    socket.on('task:unassigned', ({ taskId }) => st().setAssignee(taskId, null));
    socket.on('activity:created', (e: ProjectEventI) => onActivity?.(e))

    return () => {
      socket.emit('project:leave', projectId)
      socket.off('connect', join)
      ;[
        'project:updated', 'project:status', 'member:added', 'member:removed', 'project:kicked',
        'list:created', 'lists:reordered', 'task:created', 'task:updated', 'task:moved',
        'task:deleted', 'task:assigned', 'task:unassigned','activity:created'
      ].forEach((e) => socket.off(e))
    }
  }, [socket, projectId])
}