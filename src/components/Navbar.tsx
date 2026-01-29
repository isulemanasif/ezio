"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Search, Heart, MessageCircle } from 'lucide-react'

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .maybeSingle()
                setProfile(data)
            }
        }
        getData()
    }, [])

    return (
        <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40 px-8 flex items-center justify-between">
            <div className="flex-1 max-w-sm">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-gray-200 rounded-lg text-sm outline-none transition-all focus:bg-white"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <Heart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-red-500 transition-colors" />
                <MessageCircle className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors" />

                <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                        <img
                            src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'Eziogram'}`}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </Link>
            </div>
        </nav>
    )
}
