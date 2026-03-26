import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
  visitorName?: string
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function MessageBubble({ message, visitorName }: MessageBubbleProps) {
  const isAdmin = message.sender === 'admin'

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] space-y-1`}>
        {!isAdmin && (
          <p
            className="font-space-mono text-xs px-1"
            style={{ color: 'var(--text-secondary)', fontSize: '0.6rem', letterSpacing: '0.05em' }}
          >
            {visitorName || 'Visitor'}
          </p>
        )}
        {isAdmin && (
          <p
            className="font-space-mono text-xs px-1 text-right"
            style={{ color: 'var(--accent-green)', fontSize: '0.6rem', letterSpacing: '0.05em' }}
          >
            torch. support
          </p>
        )}
        <div
          className={`px-4 py-3 ${isAdmin ? 'chat-bubble-admin' : 'chat-bubble-visitor'}`}
        >
          <p
            className="font-syne text-sm leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            {message.content}
          </p>
        </div>
        <p
          className="font-space-mono text-xs px-1"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.55rem',
            textAlign: isAdmin ? 'right' : 'left',
          }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
