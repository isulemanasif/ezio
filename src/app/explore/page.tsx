"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ExplorePage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchExplorePosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) {
                console.error(error)
            } else {
                setPosts(data || [])
            }
            setLoading(false)
        }

        fetchExplorePosts()
    }, [])

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto py-8">
                {/* Search Header for Mobile/Explore */}
                <div className="mb-8 px-4 md:hidden">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Explore people, trends, topics..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-8 text-gray-900 px-4 hidden md:block">Explore Trending</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl mx-4">
                        <p className="text-gray-500">Connecting you with the world... No posts found yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 px-2 md:px-0">
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-sm aspect-square ${i % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                                    }`}
                            >
                                <img
                                    src={post.image_url}
                                    alt="Explore content"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={post.profiles?.avatar_url}
                                            className="w-6 h-6 rounded-full border border-white/50"
                                            alt="avatar"
                                        />
                                        <span className="text-white text-xs font-bold truncate">{post.profiles?.username}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2 text-white text-xs font-bold">
                                        <div className="flex items-center space-x-1">
                                            <span>❤️</span>
                                            <span>{post.likes_count}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span>💬</span>
                                            <span>0</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
