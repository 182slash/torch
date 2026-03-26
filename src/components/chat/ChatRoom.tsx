'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Circle, LogIn } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { getAdminSocket, disconnectAdminSocket } from '@/lib/socket'
import type { VisitorSession, Message } from '@/types/chat'
import type { Socket } from 'socket.io-client'

// ─── Login Gate ──────────────────────────────────────────────────
function LoginGate({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password) {
      sessionStorage.setItem('torch_admin_token', password)
      onLogin(password)
    } else {
      setError(true)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg-void)' }}
    >
      <div
        className="w-full max-w-sm p-8 corner-bracket relative"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 0 40px rgba(0,212,255,0.1)',
        }}
      >
        <div className="mb-8 text-center">
          <p className="font-orbitron font-black text-2xl" style={{ color: 'var(--text-primary)' }}>
            torch<span style={{ color: 'var(--accent-cyan)' }}>.</span>
          </p>
          <p className="font-space-mono text-xs mt-2 tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Enter admin token"
            className="cyber-input"
            required
          />
          {error && (
            <p className="font-space-mono text-xs" style={{ color: '#ff4444', fontSize: '0.65rem' }}>
              Invalid credentials
            </p>
          )}
          <button type="submit" className="neon-btn w-full flex items-center justify-center gap-2">
            <LogIn size={14} />
            ACCESS DASHBOARD
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Admin Dashboard ─────────────────────────────────────────────
function AdminDashboard({ token }: { token: string }) {
  const [sessions, setSessions] = useState<VisitorSession[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [typingVisitors, setTypingVisitors] = useState<Set<string>>(new Set())
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = getAdminSocket(token)
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('admin:sessions', (data: VisitorSession[]) => {
      setSessions(data)
    })

    socket.on('visitor:join', (session: VisitorSession) => {
      setSessions((prev) => {
        const exists = prev.find((s) => s.id === session.id)
        if (exists) return prev.map((s) => s.id === session.id ? { ...s, isOnline: true } : s)
        return [...prev, session]
      })
    })

    socket.on('visitor:message', (data: { visitorId: string; message: Message }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === data.visitorId
            ? { ...s, messages: [...s.messages, data.message] }
            : s
        )
      )
    })

    socket.on('admin:message', (data: { visitorId: string; message: Message }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === data.visitorId
            ? { ...s, messages: [...s.messages, data.message] }
            : s
        )
      )
    })

    socket.on('visitor:typing', (data: { visitorId: string; isTyping: boolean }) => {
      setTypingVisitors((prev) => {
        const next = new Set(prev)
        if (data.isTyping) next.add(data.visitorId)
        else next.delete(data.visitorId)
        return next
      })
    })

    socket.on('visitor:disconnect', (data: { visitorId: string }) => {
      setSessions((prev) =>
        prev.map((s) => s.id === data.visitorId ? { ...s, isOnline: false } : s)
      )
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('admin:sessions')
      socket.off('visitor:join')
      socket.off('visitor:message')
      socket.off('admin:message')
      socket.off('visitor:typing')
      socket.off('visitor:disconnect')
      disconnectAdminSocket()
    }
  }, [token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sessions, selectedId])

  const sendMessage = useCallback(() => {
    const content = inputValue.trim()
    if (!content || !selectedId || !socketRef.current) return
    socketRef.current.emit('admin:message', { visitorId: selectedId, content })
    setInputValue('')
  }, [inputValue, selectedId])

  const selectedSession = sessions.find((s) => s.id === selectedId)

  return (
    <div
      className="flex h-screen pt-16"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Sidebar */}
      <div
        className="w-72 flex-shrink-0 flex flex-col"
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-glow)',
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-glow)' }}
        >
          <div>
            <p className="font-orbitron font-black text-sm" style={{ color: 'var(--text-primary)' }}>
              Support Dashboard
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: isConnected ? 'var(--accent-green)' : '#ff4444',
                  boxShadow: isConnected ? '0 0 6px var(--accent-green)' : 'none',
                }}
              />
              <span className="font-space-mono text-xs" style={{ color: 'var(--text-secondary)', fontSize: '0.6rem' }}>
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
          <span
            className="font-space-mono text-xs px-2 py-1"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: 'var(--accent-cyan)',
              fontSize: '0.6rem',
            }}
          >
            {sessions.filter((s) => s.isOnline).length} online
          </span>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-space-mono text-xs" style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                No active visitors
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const lastMsg = session.messages[session.messages.length - 1]
              const isSelected = session.id === selectedId
              const isTyping = typingVisitors.has(session.id)

              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedId(session.id)}
                  className="w-full px-4 py-3 text-left transition-colors duration-150 border-b"
                  style={{
                    background: isSelected ? 'rgba(0,212,255,0.08)' : 'transparent',
                    borderColor: isSelected ? 'rgba(0,212,255,0.2)' : 'var(--border-glow)',
                    borderLeft: isSelected ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-orbitron text-xs font-bold" style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)', fontSize: '0.65rem' }}>
                      {session.name}
                    </span>
                    <Circle
                      size={7}
                      fill={session.isOnline ? 'var(--accent-green)' : 'var(--text-secondary)'}
                      style={{ color: session.isOnline ? 'var(--accent-green)' : 'var(--text-secondary)', flexShrink: 0 }}
                    />
                  </div>
                  <p className="font-syne text-xs truncate" style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                    {isTyping ? (
                      <span style={{ color: 'var(--accent-cyan)' }}>typing...</span>
                    ) : (
                      lastMsg?.content || 'No messages yet'
                    )}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedSession ? (
          <>
            {/* Chat header */}
            <div
              className="px-6 py-4 flex items-center gap-3 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border-glow)', background: 'var(--bg-surface)' }}
            >
              <Circle
                size={9}
                fill={selectedSession.isOnline ? 'var(--accent-green)' : 'var(--text-secondary)'}
                style={{ color: selectedSession.isOnline ? 'var(--accent-green)' : 'var(--text-secondary)' }}
              />
              <div>
                <p className="font-orbitron font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {selectedSession.name}
                </p>
                <p className="font-space-mono text-xs" style={{ color: 'var(--text-secondary)', fontSize: '0.6rem' }}>
                  {selectedSession.isOnline ? 'Online' : 'Offline'} · {selectedSession.messages.length} messages
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedSession.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="font-space-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    No messages yet
                  </p>
                </div>
              ) : (
                selectedSession.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} visitorName={selectedSession.name} />
                ))
              )}
              {typingVisitors.has(selectedSession.id) && (
                <div className="flex justify-start mb-3">
                  <div className="px-4 py-3 chat-bubble-visitor">
                    <div className="typing-indicator flex gap-1">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border-glow)', background: 'var(--bg-surface)' }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={`Reply to ${selectedSession.name}...`}
                className="cyber-input flex-1"
                disabled={!selectedSession.isOnline}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || !selectedSession.isOnline}
                className="p-2.5 transition-all duration-200"
                style={{
                  background: inputValue.trim() && selectedSession.isOnline ? 'var(--accent-green)' : 'rgba(0,255,136,0.1)',
                  color: inputValue.trim() && selectedSession.isOnline ? 'var(--bg-void)' : 'var(--text-secondary)',
                  border: '1px solid rgba(0,255,136,0.3)',
                }}
                aria-label="Send reply"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{ border: '1px solid var(--border-glow)' }}
            >
              <Send size={24} style={{ color: 'var(--border-glow)' }} />
            </div>
            <p className="font-orbitron text-sm" style={{ color: 'var(--text-secondary)' }}>
              Select a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────
export function ChatRoom() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('torch_admin_token')
    if (stored) setToken(stored)
  }, [])

  if (!token) {
    return <LoginGate onLogin={setToken} />
  }

  return <AdminDashboard token={token} />
}
