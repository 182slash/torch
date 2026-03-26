export interface Message {
  id: string
  content: string
  sender: 'visitor' | 'admin'
  timestamp: number
  visitorId: string
}

export interface VisitorSession {
  id: string
  name: string
  connectedAt: number
  messages: Message[]
  isOnline: boolean
}

export interface ChatState {
  isOpen: boolean
  visitorId: string
  visitorName: string
  messages: Message[]
  isAdminTyping: boolean
  isConnected: boolean
}

export interface AdminState {
  sessions: VisitorSession[]
  selectedVisitorId: string | null
  typingVisitors: Set<string>
}
