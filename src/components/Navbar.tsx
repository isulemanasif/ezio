"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Search, Heart, MessageCircle } from 'lucide-react'

export function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length === 0) {
                setResults([])
                return
            }

            setIsSearching(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
                .limit(5)

            if (error) {
                console.error('Search error:', error)
            } else {
                setResults(data || [])
            }
            setIsSearching(false)
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

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
        <nav className="fixed top-0 left-64 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-white/20 z-40 px-8 flex items-center justify-between shadow-sm">
            <div className="flex-1 max-w-sm relative">
                <div className="relative group z-50">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-11 pr-5 py-3 bg-gray-100/50 border-2 border-transparent focus:border-blue-200 rounded-2xl text-sm outline-none transition-all focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 font-medium placeholder:text-gray-400"
                    />
                </div>

                {/* Search Results Dropdown */}
                {query.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-2 z-50">
                        {isSearching ? (
                            <div className="px-4 py-3 text-sm text-gray-400 flex items-center space-x-2">
                                <Search className="w-4 h-4 animate-pulse" />
                                <span>Searching...</span>
                            </div>
                        ) : results.length > 0 ? (
                            <ul>
                                {results.map((result) => (
                                    <li key={result.id}>
                                        <Link
                                            href={`/profile/${result.id}`}
                                            onClick={() => {
                                                setQuery('')
                                                setResults([])
                                            }}
                                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <img
                                                src={result.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.id}`}
                                                alt={result.username}
                                                className="w-8 h-8 rounded-full object-cover mr-3"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{result.username}</p>
                                                <p className="text-xs text-gray-500">{result.full_name}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">No users found.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-6">
                <Heart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-red-500 transition-colors" />
                <Link href="/reels">
                    <div className="relative group">
                        <MessageCircle className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors transform rotate-90" /> {/* Using MessageCircle rotated as a placeholder for Reels icon if Video icon not imported */}
                    </div>
                </Link>

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
