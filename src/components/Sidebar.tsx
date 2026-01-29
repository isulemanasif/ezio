"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Compass, PlaySquare, MessageSquare, Heart, PlusSquare, User, LogOut } from 'lucide-react'
import { EziogramLogo } from '@/components/EziogramLogo'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: PlaySquare, label: 'Reels', href: '/reels' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Heart, label: 'Notifications', href: '/notifications' },
    { icon: PlusSquare, label: 'Create', href: '/create' },
    { icon: User, label: 'Profile', href: '/profile' },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="fixed md:left-0 md:top-0 bottom-0 left-0 right-0 md:h-screen md:w-64 h-16 w-full border-t md:border-r border-gray-200 md:border-white/20 bg-white/90 md:bg-white/80 backdrop-blur-2xl flex md:flex-col flex-row items-center md:items-stretch justify-around md:justify-start p-2 md:p-4 z-50 transition-all duration-300 md:shadow-2xl md:shadow-blue-900/5">
            <Link href="/" className="hidden md:flex items-center space-x-3 px-3 mb-10 group">
                <EziogramLogo size={32} />
                <span className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">Eziogram</span>
            </Link>

            <nav className="flex-1 flex md:flex-col flex-row justify-around md:justify-start w-full md:space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center md:space-x-4 p-2 md:px-4 md:py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'text-blue-600 font-bold md:bg-blue-50/50 md:shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {isActive && (
                                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                            )}
                            <Icon className={`w-6 h-6 md:w-6 md:h-6 group-hover:scale-110 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                            <span className="hidden md:block text-base tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-4 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-500 transition-colors mt-auto group font-bold"
            >
                <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <span className="text-base">Logout</span>
            </button>
        </div>
    )
}
