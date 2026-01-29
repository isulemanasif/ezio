"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Reel } from '@/components/Reel'
import { Loader2 } from 'lucide-react'

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
                console.error('Error fetching reels:', error)
            } else {
                setReels(data || [])
            }
            setLoading(false)
        }

        fetchReels()
    }, [])

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
            {reels.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white">
                    <p>No reels yet.</p>
                </div>
            ) : (
                reels.map((reel) => (
                    <Reel
                        key={reel.id}
                        reel={{
                            ...reel,
                            username: reel.profiles?.username || 'user',
                            avatar: reel.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=reel',
                            videoPlaceholder: reel.video_url, // Mapping database column to component prop
                            likes: reel.likes_count || 0,
                            description: reel.caption,
                            music: reel.music_track
                        }}
                    />
                ))
            )}
        </div>
    )
}
