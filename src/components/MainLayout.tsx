"use client"

import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchSuggestions = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            // Fetch suggestions
            const { data } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .neq('id', user?.id || '')
                .limit(5)

            setSuggestions(data || [])
        }
        fetchSuggestions()
    }, [])

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans">
            {/* Sidebar - Persistent */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col pt-20 pb-20 md:pb-0 transition-all duration-300">
                <Navbar />
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto flex gap-10">
                        {children}

                        {/* Right Sidebar - Suggestions */}
                        <div className="hidden lg:block w-80 sticky top-28 h-fit">
                            <div className="space-y-6">
                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl shadow-gray-200/50">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Suggested for you</h3>
                                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">See All</button>
                                    </div>

                                    <div className="space-y-5">
                                        {suggestions?.map((profile: any) => (
                                            <div key={profile.id} className="flex items-center justify-between group">
                                                <Link href={`/profile/${profile.id}`} className="flex items-center space-x-3 cursor-pointer">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 p-0.5 overflow-hidden border border-gray-100 group-hover:border-blue-200 transition-colors">
                                                        <img
                                                            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                                                            className="w-full h-full rounded-full object-cover"
                                                            alt={profile.username}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{profile.username}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-1 truncate w-24">Popular</p>
                                                    </div>
                                                </Link>
                                                <button className="text-xs font-black text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                                    Follow
                                                </button>
                                            </div>
                                        ))}

                                        {(!suggestions || suggestions.length === 0) && (
                                            <p className="text-xs text-gray-400">No suggestions available.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-gray-300 px-2 font-medium">
                                    {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms'].map((link) => (
                                        <span key={link} className="hover:underline cursor-pointer hover:text-gray-400 transition-colors">{link}</span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-300 px-2 font-black uppercase italic tracking-widest">© 2026 EZIOGRAM</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
