'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  CreditCard, 
  Target, 
  BarChart3, 
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Budgets', href: '/budgets', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface BottomNavProps {
  className?: string
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden",
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-2 text-xs font-medium transition-all duration-200 hover:scale-105",
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "mb-1 transition-all duration-200",
                  isActive ? "text-white scale-110" : "text-gray-400 hover:scale-110"
                )}
              />
              <span className={cn(
                "transition-colors duration-200",
                isActive ? "text-white" : "text-gray-400"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
