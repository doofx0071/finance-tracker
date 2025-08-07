'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  CreditCard, 
  Target, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Budgets', href: '/budgets', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-black border-r border-gray-800 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white transition-opacity duration-300">Finance Tracker</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md hover:bg-gray-800 text-white transition-all duration-200 hover:scale-110"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105",
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md",
                isCollapsed && "justify-center"
              )}
            >
              <Icon size={20} className={cn(
                "transition-transform duration-200",
                isCollapsed ? "" : "mr-3",
                !isActive && "group-hover:scale-110"
              )} />
              {!isCollapsed && (
                <span className="transition-opacity duration-300">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            Finance Tracker v1.0
          </div>
        )}
      </div>
    </div>
  )
}
