// app/chat/layout.tsx
import Sidebar from '@/components/features/Sidebar';
import { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
