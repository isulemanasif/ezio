"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export function StoryViewer({
    stories,
    initialIndex,
    onClose
}: {
    stories: any[],
    initialIndex: number,
    onClose: () => void
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [progress, setProgress] = useState(0)
    const story = stories[currentIndex]

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    return 100
                }
                return prev + 1
            })
        }, 50)

        return () => clearInterval(timer)
    }, [currentIndex])

    useEffect(() => {
        if (progress >= 100) {
            handleNext()
        }
    }, [progress])

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setProgress(0)
        } else {
            onClose()
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
            setProgress(0)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 text-white p-2 hover:bg-white/10 rounded-full"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-2xl overflow-hidden bg-gray-900 aspect-[9/16]">
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                    {stories.map((s, i) => (
                        <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: i < currentIndex ? '100%' : '0%' }}
                                animate={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 z-20 flex items-center space-x-3">
                    <img
                        src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user_id}`}
                        className="w-10 h-10 rounded-full border-2 border-white/50"
                        alt="Avatar"
                    />
                    <span className="text-white font-bold drop-shadow-md">{story.profiles?.username || 'User'}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Currently stories are image-only in CreatePage, but keeping video structure for future */}
                    {story.media_type === 'video' ? (
                        <video
                            src={story.video_url || story.media_url}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            onEnded={handleNext}
                        />
                    ) : (
                        <img
                            src={story.image_url || story.media_url}
                            className="w-full h-full object-cover"
                            alt="Story"
                        />
                    )}
                </div>

                {/* Navigation Zones */}
                <div className="absolute inset-0 flex z-10">
                    <div className="w-1/3 h-full" onClick={handlePrev} />
                    <div className="w-1/3 h-full" onClick={handleNext} />
                    <div className="w-1/3 h-full" onClick={handleNext} />
                </div>

                {/* Footer Input */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={`Reply to ${story.profiles?.username}...`}
                            className="w-full bg-transparent border border-white/50 rounded-full px-4 py-3 text-white placeholder:text-white/70 focus:outline-none focus:border-white focus:bg-white/10"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value
                                    if (!val.trim()) return
                                    const { data: { user } } = await createClient().auth.getUser()
                                    if (user) {
                                        await createClient().from('comments').insert({
                                            user_id: user.id,
                                            story_id: story.id, // Assuming this column exists or will be added
                                            content: val
                                        })
                                            ; (e.target as HTMLInputElement).value = ''
                                        alert('Reply sent!')
                                    }
                                }
                            }}
                        />
                    </div>
                    <button
                        className="text-white active:scale-90 transition-transform"
                        onClick={async () => {
                            const { data: { user } } = await createClient().auth.getUser()
                            if (user) {
                                const supabase = createClient()
                                // Check if already liked
                                const { data } = await supabase.from('likes').select('*').eq('story_id', story.id).eq('user_id', user.id).maybeSingle()
                                if (data) {
                                    await supabase.from('likes').delete().eq('story_id', story.id).eq('user_id', user.id)
                                } else {
                                    await supabase.from('likes').insert({ story_id: story.id, user_id: user.id })
                                }
                                alert('Story Liked!')
                            }
                        }}
                    >
                        <Heart className="w-8 h-8" />
                    </button>
                    <button className="text-white">
                        <Send className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    )
}
