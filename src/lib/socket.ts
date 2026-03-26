import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || ''

let visitorSocket: Socket | null = null
let adminSocket: Socket | null = null

export function getVisitorSocket(visitorId: string): Socket {
  if (visitorSocket && visitorSocket.connected) return visitorSocket

  visitorSocket = io(`${SOCKET_URL}/visitor`, {
    query: { visitorId },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  })

  return visitorSocket
}

export function disconnectVisitorSocket(): void {
  if (visitorSocket) {
    visitorSocket.disconnect()
    visitorSocket = null
  }
}

export function getAdminSocket(token: string): Socket {
  if (adminSocket && adminSocket.connected) return adminSocket

  adminSocket = io(`${SOCKET_URL}/admin`, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  })

  return adminSocket
}

export function disconnectAdminSocket(): void {
  if (adminSocket) {
    adminSocket.disconnect()
    adminSocket = null
  }
}
