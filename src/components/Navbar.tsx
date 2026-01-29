"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Search, Heart, MessageCircle } from 'lucide-react'

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    return (
        <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 md:left-64 left-0">
            <div className="flex-1 max-w-lg">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search communities, people, posts..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MessageCircle className="w-6 h-6 text-gray-700" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="w-6 h-6 text-gray-700" />
                </button>
                <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                        <img
                            src={user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}` : "https://api.dicebear.com/7.x/avataaars/svg?seed=Eziogram"}
                            alt="Profile"
                            className="w-full h-full rounded-full"
                        />
                    </div>
                </Link>
            </div>
        </div>
    )
}
