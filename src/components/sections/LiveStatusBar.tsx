'use client'

import { useEffect, useState } from 'react'

export function LiveStatusBar() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const id = new Intl.DateTimeFormat('en-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      const dateId = new Intl.DateTimeFormat('en-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      setTime(id.format(now))
      setDate(dateId.format(now))
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const items = [
    { label: 'SYSTEM',         value: 'ONLINE',                   color: 'var(--accent-green)'  },
    { label: 'INDONESIA TIME', value: time,                        color: 'var(--accent-cyan)'   },
    { label: 'TIMEZONE',       value: 'UTC+7 WIB',                 color: 'var(--text-secondary)'},
    { label: 'DATE',           value: date,                        color: 'var(--text-secondary)'},
    { label: 'STATUS',         value: 'ALL SERVICES OPERATIONAL',  color: 'var(--accent-green)'  },
  ]

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-glow)',
        borderTop: '1px solid var(--border-glow)',
        position: 'relative',
        zIndex: 50,
        marginBottom: '-3px',
        marginTop: '-7vh',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-0"
          style={{ paddingTop: '14px', paddingBottom: '14px' }}  /* 15.6 * 0.9 */
        >
          {items.map((item, i) => (
            <div key={item.label} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="hidden sm:block w-px mr-4"
                  style={{
                    height: '18.72px',          /* 20.8 * 0.9 */
                    background: 'var(--border-glow)',
                  }}
                  aria-hidden="true"
                />
              )}
              <span
                className="font-space-mono uppercase tracking-widest"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.702rem',         /* 0.78 * 0.9 */
                }}
              >
                {item.label}:
              </span>
              <span
                className="font-space-mono font-bold tracking-wider tabular-nums"
                style={{
                  color: item.color,
                  fontSize: '0.761rem',         /* 0.845 * 0.9 */
                }}
              >
                {item.value || '──────'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}