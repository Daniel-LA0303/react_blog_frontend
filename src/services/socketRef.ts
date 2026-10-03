// services/socketRef.ts
import type { Socket } from 'socket.io-client'

let current: Socket | null = null

export const setSocket = (s: Socket | null) => { current = s }
export const getSocket = () => current