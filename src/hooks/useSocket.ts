'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { getVisitorSocket, disconnectVisitorSocket } from '@/lib/socket'
import type { Message } from '@/types/chat'

export function useVisitorSocket(visitorId: string) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isAdminTyping, setIsAdminTyping] = useState(false)
  const [visitorName, setVisitorName] = useState('')

  useEffect(() => {
    if (!visitorId) return

    const socket = getVisitorSocket(visitorId)
    socketRef.current = socket

    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    const onRegistered = (data: { id: string; name: string }) => {
      setVisitorName(data.name)
    }

    const onAdminMessage = (data: { message: Message }) => {
      setMessages((prev) => [...prev, data.message])
    }

    const onAdminTyping = (data: { isTyping: boolean }) => {
      setIsAdminTyping(data.isTyping)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('visitor:registered', onRegistered)
    socket.on('admin:message', onAdminMessage)
    socket.on('admin:typing', onAdminTyping)

    if (socket.connected) setIsConnected(true)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('visitor:registered', onRegistered)
      socket.off('admin:message', onAdminMessage)
      socket.off('admin:typing', onAdminTyping)
    }
  }, [visitorId])

  const sendMessage = useCallback(
    (content: string) => {
      const socket = socketRef.current
      if (!socket || !isConnected) return

      const message: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender: 'visitor',
        timestamp: Date.now(),
        visitorId,
      }
      setMessages((prev) => [...prev, message])
      socket.emit('visitor:message', { content })
    },
    [isConnected, visitorId]
  )

  const sendTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit('visitor:typing', { isTyping })
  }, [])

  const disconnect = useCallback(() => {
    disconnectVisitorSocket()
    setIsConnected(false)
  }, [])

  return { isConnected, messages, isAdminTyping, visitorName, sendMessage, sendTyping, disconnect }
}
