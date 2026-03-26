import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

interface Message {
  id: string
  content: string
  sender: 'visitor' | 'admin'
  timestamp: number
  visitorId: string
}

interface VisitorSession {
  id: string
  name: string
  connectedAt: number
  messages: Message[]
  isOnline: boolean
  socketId: string
}

const visitorSessions = new Map<string, VisitorSession>()

function generateVisitorName(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `Visitor #${num}`
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  // ─── Declare both namespaces upfront to avoid forward-ref issues ──
  const visitorNs = io.of('/visitor')
  const adminNs = io.of('/admin')

  // ─── Visitor namespace handlers ──────────────────────────────────
  visitorNs.on('connection', (socket) => {
    const visitorId = (socket.handshake.query.visitorId as string) || socket.id
    const name = generateVisitorName()

    const session: VisitorSession = {
      id: visitorId,
      name,
      connectedAt: Date.now(),
      messages: [],
      isOnline: true,
      socketId: socket.id,
    }
    visitorSessions.set(visitorId, session)

    socket.join(`room:${visitorId}`)

    // Notify admin of new visitor
    adminNs.emit('visitor:join', {
      id: session.id,
      name: session.name,
      connectedAt: session.connectedAt,
      isOnline: true,
      messages: [],
    })

    // Confirm registration to visitor
    socket.emit('visitor:registered', { id: visitorId, name })

    socket.on('visitor:message', (data: { content: string }) => {
      const sess = visitorSessions.get(visitorId)
      if (!sess) return

      const message: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: data.content,
        sender: 'visitor',
        timestamp: Date.now(),
        visitorId,
      }
      sess.messages.push(message)

      // Forward to all admin sockets
      adminNs.emit('visitor:message', { visitorId, message })
    })

    socket.on('visitor:typing', (data: { isTyping: boolean }) => {
      adminNs.emit('visitor:typing', { visitorId, isTyping: data.isTyping })
    })

    socket.on('disconnect', () => {
      const sess = visitorSessions.get(visitorId)
      if (sess) {
        sess.isOnline = false
        adminNs.emit('visitor:disconnect', { visitorId })
      }
    })
  })

  // ─── Admin namespace auth middleware ─────────────────────────────

  adminNs.use((socket, next) => {
    const token = socket.handshake.auth.token as string
    if (token === process.env.ADMIN_TOKEN) {
      next()
    } else {
      next(new Error('Unauthorized'))
    }
  })

  adminNs.on('connection', (socket) => {
    // Send all current sessions to newly connected admin
    const sessions = Array.from(visitorSessions.values()).map((s) => ({
      id: s.id,
      name: s.name,
      connectedAt: s.connectedAt,
      messages: s.messages,
      isOnline: s.isOnline,
    }))
    socket.emit('admin:sessions', sessions)

    socket.on('admin:message', (data: { visitorId: string; content: string }) => {
      const session = visitorSessions.get(data.visitorId)
      if (!session) return

      const message: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: data.content,
        sender: 'admin',
        timestamp: Date.now(),
        visitorId: data.visitorId,
      }
      session.messages.push(message)

      // Forward to visitor
      visitorNs.to(`room:${data.visitorId}`).emit('admin:message', { message })

      // Broadcast to other admin sockets
      socket.broadcast.emit('admin:message', { visitorId: data.visitorId, message })
    })

    socket.on('admin:typing', (data: { visitorId: string; isTyping: boolean }) => {
      visitorNs.to(`room:${data.visitorId}`).emit('admin:typing', { isTyping: data.isTyping })
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(
        `> Torch server ready on http://${hostname}:${port} [${dev ? 'development' : 'production'}]`
      )
    })
})
