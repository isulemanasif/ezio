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
        <div className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white flex flex-col p-4 z-50 transition-all duration-300">
            <Link href="/" className="flex items-center space-x-3 px-3 mb-10 group">
                <EziogramLogo size={32} />
                <span className="text-2xl font-bold italic group-hover:text-blue-600 transition-colors">Eziogram</span>
            </Link>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-gray-100 ${isActive ? 'font-bold' : ''
                                }`}
                        >
                            <Icon className={`w-6 h-6 group-hover:scale-110 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                            <span className="text-base">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-auto group"
            >
                <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <span className="text-base font-semibold">Logout</span>
            </button>
        </div>
    )
}
