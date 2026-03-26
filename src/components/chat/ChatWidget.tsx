'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Wifi, WifiOff } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { MessageBubble } from './MessageBubble'
import { useVisitorSocket } from '@/hooks/useSocket'
import type { Message } from '@/types/chat'

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'torch_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(key, id)
  }
  return id
}

// ─── Cyberpunk glitch chat icon ───────────────────────────────────────────────
// Dark icon on bright cyan button — high contrast, larger strokes.
// Glitch burst every 3.5s: RGB split + scanline.
function GlitchChatIcon() {
  return (
    <span style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38.5,
      height: 38.5,
    }}>
      <style>{`
        @keyframes cgMain {
          0%,78%,100% { opacity:1; transform:translate(0,0) skewX(0deg); }
          79%  { opacity:0.85; transform:translate(-3px,0) skewX(-5deg); }
          80%  { opacity:1;    transform:translate(3px,0)  skewX(4deg);  }
          81%  { opacity:0.9;  transform:translate(-1px,1px) skewX(-2deg); }
          82%  { opacity:1;    transform:translate(0,0) skewX(0deg); }
          93%  { opacity:0.92; transform:translate(2px,-1px) skewX(2deg); }
          94%  { opacity:1;    transform:translate(0,0) skewX(0deg); }
        }
        @keyframes cgR {
          0%,78%,100% { opacity:0; transform:translate(0,0); clip-path:inset(50% 0 50% 0); }
          79%  { opacity:0.8;  transform:translate(4px,0);   clip-path:inset(15% 0 50% 0); }
          80%  { opacity:0.6;  transform:translate(-4px,0);  clip-path:inset(50% 0 15% 0); }
          81%  { opacity:0.7;  transform:translate(3px,0);   clip-path:inset(30% 0 25% 0); }
          82%  { opacity:0; }
          93%  { opacity:0.5;  transform:translate(-3px,1px); clip-path:inset(5% 0 65% 0); }
          94%  { opacity:0; }
        }
        @keyframes cgB {
          0%,78%,100% { opacity:0; transform:translate(0,0); clip-path:inset(50% 0 50% 0); }
          79%  { opacity:0.6;  transform:translate(-4px,0);  clip-path:inset(50% 0 10% 0); }
          80%  { opacity:0.5;  transform:translate(4px,0);   clip-path:inset(15% 0 50% 0); }
          81%  { opacity:0.65; transform:translate(-2px,0);  clip-path:inset(35% 0 20% 0); }
          82%  { opacity:0; }
          93%  { opacity:0.4;  transform:translate(3px,-1px); clip-path:inset(60% 0 5% 0); }
          94%  { opacity:0; }
        }
        @keyframes cgScan {
          0%,77%  { top:-2px; opacity:0; }
          78%      { top:0px;  opacity:0.9; }
          80%      { top:34px; opacity:0.2; }
          81%,100% { opacity:0; }
        }
        @keyframes cgDot {
          0%,100% { opacity:1;   r:1.8; }
          50%      { opacity:0.3; r:1.2; }
        }
        @keyframes cgCorner {
          0%,77%,100% { opacity:0.7; }
          79%          { opacity:0;   }
          82%          { opacity:1;   }
        }
      `}</style>

      {/* Main — bright green strokes on dark glass button */}
      <svg
        style={{ animation: 'cgMain 3.5s steps(1) infinite' }}
        width="38.5" height="38.5" viewBox="0 0 32 32" fill="none"
      >
        {/* Bubble body */}
        <rect x="2" y="2" width="26" height="20" rx="3"
          fill="rgba(0,255,102,0.06)" stroke="#00ff66" strokeWidth="2.2" />
        {/* Tail */}
        <path d="M8 22 L4.5 28.5 L15 22"
          fill="rgba(0,255,102,0.06)" stroke="#00ff66" strokeWidth="2" strokeLinejoin="round" />
        {/* Three pulsing dots */}
        <circle cx="9"  cy="12" r="1.8" fill="#00ff66"
          style={{ animation: 'cgDot 1.2s ease-in-out infinite 0s' }} />
        <circle cx="16" cy="12" r="1.8" fill="#00ff66"
          style={{ animation: 'cgDot 1.2s ease-in-out infinite 0.2s' }} />
        <circle cx="23" cy="12" r="1.8" fill="#00ff66"
          style={{ animation: 'cgDot 1.2s ease-in-out infinite 0.4s' }} />
        {/* Corner brackets */}
        <polyline points="22,2.5 28,2.5 28,8"
          fill="none" stroke="rgba(0,255,102,0.5)" strokeWidth="1.6"
          style={{ animation: 'cgCorner 3.5s steps(1) infinite' }} />
        <polyline points="3,22 3,28 9,28"
          fill="none" stroke="rgba(0,255,102,0.5)" strokeWidth="1.6"
          style={{ animation: 'cgCorner 3.5s steps(1) infinite 0.08s' }} />
      </svg>

      {/* Red glitch ghost */}
      <svg
        style={{ position:'absolute', top:0, left:0, opacity:0,
          animation: 'cgR 3.5s steps(1) infinite' }}
        width="38.5" height="38.5" viewBox="0 0 32 32" fill="none"
      >
        <rect x="2" y="2" width="26" height="20" rx="3"
          fill="none" stroke="#ff003c" strokeWidth="2.2" />
        <circle cx="9"  cy="12" r="1.8" fill="#ff003c" />
        <circle cx="16" cy="12" r="1.8" fill="#ff003c" />
        <circle cx="23" cy="12" r="1.8" fill="#ff003c" />
      </svg>

      {/* Blue glitch ghost */}
      <svg
        style={{ position:'absolute', top:0, left:0, opacity:0,
          animation: 'cgB 3.5s steps(1) infinite' }}
        width="38.5" height="38.5" viewBox="0 0 32 32" fill="none"
      >
        <rect x="2" y="2" width="26" height="20" rx="3"
          fill="none" stroke="#0088ff" strokeWidth="2.2" />
        <circle cx="9"  cy="12" r="1.8" fill="#0088ff" />
        <circle cx="16" cy="12" r="1.8" fill="#0088ff" />
        <circle cx="23" cy="12" r="1.8" fill="#0088ff" />
      </svg>

      {/* Scanline sweep */}
      <span style={{
        position: 'absolute', left: -4, right: -4,
        height: '2px',
        background: 'rgba(0,255,102,0.6)',
        pointerEvents: 'none',
        animation: 'cgScan 3.5s linear infinite',
      }} />
    </span>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [visitorId] = useState(() =>
    typeof window !== 'undefined' ? getOrCreateVisitorId() : ''
  )
  const [inputValue, setInputValue] = useState('')
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { isConnected, messages, isAdminTyping, visitorName, sendMessage, sendTyping } =
    useVisitorSocket(visitorId)

  useEffect(() => { setLocalMessages(messages) }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isAdminTyping])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150)
  }, [isOpen])

  const handleSend = useCallback(() => {
    const content = inputValue.trim()
    if (!content) return
    sendMessage(content)
    setInputValue('')
    sendTyping(false)
  }, [inputValue, sendMessage, sendTyping])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      sendTyping(true)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(() => sendTyping(false), 1500)
    },
    [sendTyping]
  )

  return (
    <>
      {/* Chat Panel */}
      <div
        className="fixed bottom-24 right-5 z-50 transition-all duration-300"
        style={{
          width: '320px',
          maxHeight: '480px',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div
          className="flex flex-col h-full overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 0 40px rgba(0,212,255,0.15), 0 24px 48px rgba(0,0,0,0.5)',
            height: '480px',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-glow)' }}
          >
            <div className="flex items-center gap-3">
              <div className="status-dot" />
              <div>
                <p className="font-orbitron font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                  torch<span style={{ color: 'var(--accent-cyan)' }}>.</span> support
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isConnected
                    ? <Wifi size={10} style={{ color: 'var(--accent-green)' }} />
                    : <WifiOff size={10} style={{ color: 'var(--text-secondary)' }} />
                  }
                  <span
                    className="font-space-mono"
                    style={{
                      color: isConnected ? 'var(--accent-green)' : 'var(--text-secondary)',
                      fontSize: '0.55rem',
                    }}
                  >
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-cyan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Visitor name */}
          {visitorName && (
            <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-glow)' }}>
              <span className="font-space-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                You are:{' '}
                <span style={{ color: 'var(--accent-cyan)' }}>{visitorName}</span>
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
            {localMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <MessageCircle size={32} style={{ color: 'var(--border-glow)' }} />
                <p className="font-space-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Hi! How can we help you today?
                </p>
              </div>
            )}
            {localMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} visitorName={visitorName} />
            ))}
            {isAdminTyping && (
              <div className="flex justify-start mb-3">
                <div className="px-4 py-3 chat-bubble-admin">
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
            className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid var(--border-glow)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="cyber-input flex-1"
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || !isConnected}
              className="p-2 transition-all duration-200 flex-shrink-0"
              style={{
                background: inputValue.trim() && isConnected ? 'var(--accent-cyan)' : 'rgba(0,212,255,0.1)',
                color: inputValue.trim() && isConnected ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: '1px solid rgba(0,212,255,0.3)',
              }}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 flex items-center justify-center transition-all duration-300"
        style={{
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen
          ? <X size={22} style={{ color: 'rgba(0,255,102,0.8)' }} />
          : <GlitchChatIcon />
        }
      </button>
    </>
  )
}