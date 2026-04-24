import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { Pool } from 'pg'

const port = parseInt(process.env.PORT || '3001', 10)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

// ─── Database ─────────────────────────────────────────────────────────────────

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      connected_at BIGINT NOT NULL,
      is_online BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL REFERENCES visitor_sessions(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      sender TEXT NOT NULL,
      timestamp BIGINT NOT NULL
    );
  `)
  console.log('Database initialized')
}

async function upsertSession(session: VisitorSession) {
  await db.query(
    `INSERT INTO visitor_sessions (id, name, connected_at, is_online)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET is_online = $4`,
    [session.id, session.name, session.connectedAt, session.isOnline]
  )
}

async function saveMessage(message: Message) {
  await db.query(
    `INSERT INTO messages (id, visitor_id, content, sender, timestamp)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING`,
    [message.id, message.visitorId, message.content, message.sender, message.timestamp]
  )
}

async function loadAllSessions(): Promise<VisitorSession[]> {
  const sessionsRes = await db.query(
    `SELECT * FROM visitor_sessions ORDER BY connected_at DESC LIMIT 100`
  )
  const messagesRes = await db.query(
    `SELECT * FROM messages ORDER BY timestamp ASC`
  )

  return sessionsRes.rows.map((s) => ({
    id: s.id,
    name: s.name,
    connectedAt: Number(s.connected_at),
    isOnline: false, // all offline on boot, updated when they reconnect
    socketId: '',
    messages: messagesRes.rows
      .filter((m) => m.visitor_id === s.id)
      .map((m) => ({
        id: m.id,
        content: m.content,
        sender: m.sender as 'visitor' | 'admin',
        timestamp: Number(m.timestamp),
        visitorId: m.visitor_id,
      })),
  }))
}

async function setSessionOnline(visitorId: string, isOnline: boolean) {
  await db.query(
    `UPDATE visitor_sessions SET is_online = $1 WHERE id = $2`,
    [isOnline, visitorId]
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── State ────────────────────────────────────────────────────────────────────

const visitorSessions = new Map<string, VisitorSession>()

function generateVisitorName(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `Visitor #${num}`
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', visitors: visitorSessions.size }))
    return
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Torch Socket Server running')
})

// ─── Socket.IO ────────────────────────────────────────────────────────────────

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: clientOrigin,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})

const visitorNs = io.of('/visitor')
const adminNs = io.of('/admin')

// ─── Visitor namespace ────────────────────────────────────────────────────────

visitorNs.on('connection', async (socket) => {
  const visitorId = (socket.handshake.query.visitorId as string) || socket.id

  // Restore existing session or create new one
  let session = visitorSessions.get(visitorId)
  if (!session) {
    const name = generateVisitorName()
    session = {
      id: visitorId,
      name,
      connectedAt: Date.now(),
      messages: [],
      isOnline: true,
      socketId: socket.id,
    }
    visitorSessions.set(visitorId, session)
    await upsertSession(session)
  } else {
    session.isOnline = true
    session.socketId = socket.id
    await setSessionOnline(visitorId, true)
  }

  socket.join(`room:${visitorId}`)

  adminNs.emit('visitor:join', {
    id: session.id,
    name: session.name,
    connectedAt: session.connectedAt,
    isOnline: true,
    messages: session.messages,
  })

  socket.emit('visitor:registered', { id: visitorId, name: session.name })

  socket.on('visitor:message', async (data: { content: string }) => {
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
    await saveMessage(message)

    adminNs.emit('visitor:message', { visitorId, message })
  })

  socket.on('visitor:typing', (data: { isTyping: boolean }) => {
    adminNs.emit('visitor:typing', { visitorId, isTyping: data.isTyping })
  })

  socket.on('disconnect', async () => {
    const sess = visitorSessions.get(visitorId)
    if (sess) {
      sess.isOnline = false
      await setSessionOnline(visitorId, false)
      adminNs.emit('visitor:disconnect', { visitorId })
    }
  })
})

// ─── Admin namespace ──────────────────────────────────────────────────────────

adminNs.use((socket, next) => {
  const token = socket.handshake.auth.token as string
  if (token === process.env.ADMIN_TOKEN) {
    next()
  } else {
    next(new Error('Unauthorized'))
  }
})

adminNs.on('connection', (socket) => {
  // Send all sessions including persisted history
  const sessions = Array.from(visitorSessions.values()).map((s) => ({
    id: s.id,
    name: s.name,
    connectedAt: s.connectedAt,
    messages: s.messages,
    isOnline: s.isOnline,
  }))
  socket.emit('admin:sessions', sessions)

  socket.on('admin:message', async (data: { visitorId: string; content: string }) => {
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
    await saveMessage(message)

    visitorNs.to(`room:${data.visitorId}`).emit('admin:message', { message })
    socket.broadcast.emit('admin:message', { visitorId: data.visitorId, message })
  })

  socket.on('admin:typing', (data: { visitorId: string; isTyping: boolean }) => {
    visitorNs.to(`room:${data.visitorId}`).emit('admin:typing', { isTyping: data.isTyping })
  })
})

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  await initDb()

  // Load persisted sessions into memory
  const savedSessions = await loadAllSessions()
  for (const session of savedSessions) {
    visitorSessions.set(session.id, session)
  }
  console.log(`Loaded ${savedSessions.length} sessions from database`)

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`Torch socket server ready on port ${port}`)
      console.log(`Accepting connections from: ${clientOrigin}`)
    })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})