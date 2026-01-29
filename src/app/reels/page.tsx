"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Reel } from '@/components/Reel'
import { Sidebar } from '@/components/Sidebar'
import { Loader2, PlaySquare } from 'lucide-react'

export default function ReelsPage() {
    const [reels, setReels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchReels = async () => {
            const { data, error } = await supabase
                .from('reels')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setReels(data || [])
            }
            setLoading(false)
        }

        fetchReels()
    }, [])

    return (
        <div className="flex bg-black">
            <Sidebar />
            <div className="flex-1 ml-64 h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-white" />
                    </div>
                ) : reels.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white space-y-4">
                        <PlaySquare className="w-16 h-16 text-gray-700" />
                        <p className="text-xl font-bold">No Reels yet</p>
                        <p className="text-gray-400">Be the first to create one!</p>
                    </div>
                ) : (
                    reels.map((reel) => (
                        <Reel key={reel.id} reel={{
                            ...reel,
                            username: reel.profiles?.username || 'user',
                            avatar: reel.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reel.user_id}`,
                            description: reel.description,
                            likes: reel.likes_count,
                            comments: '0',
                            shares: '0',
                            music: reel.music_name || 'Original Audio',
                            videoPlaceholder: reel.video_url
                        }} />
                    ))
                )}
            </div>
        </div>
    )
}


