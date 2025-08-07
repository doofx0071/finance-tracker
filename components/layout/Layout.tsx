'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Main Content with bottom padding for nav */}
        <main className="pb-20">
          <div className="p-4">
            {children}
          </div>
        </main>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  )
}
