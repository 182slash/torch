import dynamic from 'next/dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Chat - Torch',
  description: 'Admin support dashboard',
  robots: { index: false, follow: false },
}

const ChatRoom = dynamic(
  () => import('@/components/chat/ChatRoom').then(m => m.ChatRoom),
  { ssr: false }
)

export default function ChatPage() {
  return <ChatRoom />
}
