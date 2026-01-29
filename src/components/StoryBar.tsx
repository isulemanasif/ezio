"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const STYLES = [
    'from-yellow-400 via-red-500 to-purple-600',
    'from-blue-400 to-emerald-400',
    'from-pink-500 to-orange-400',
    'from-indigo-500 to-purple-500',
]

export function StoryBar() {
    const [stories, setStories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data, error } = await supabase
                    .from('stories')
                    .select(`
                        *,
                        profiles (
                            username,
                            avatar_url
                        )
                    `)
                    .order('created_at', { ascending: false })
                    .limit(15)

                if (error) {
                    console.error("Supabase Story Fetch Error:", error.message, error.details, error.hint)
                } else {
                    setStories(data || [])
                }
            } catch (err) {
                console.error("Unexpected Story Fetch Error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStories()
    }, [])

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        )
    }

    if (stories.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">No Active Stories</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-hidden shadow-sm">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                {stories.map((story, i) => (
                    <motion.div
                        key={story.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center space-y-1 cursor-pointer min-w-[72px]"
                    >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${STYLES[i % STYLES.length]} p-[2px]`}>
                            <div className="w-full h-full rounded-full bg-white p-[2px]">
                                <img
                                    src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user_id}`}
                                    alt={story.profiles?.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 truncate w-16 text-center">
                            {story.profiles?.username || 'user'}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
