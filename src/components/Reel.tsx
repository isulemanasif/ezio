"use client"

import { Heart, MessageCircle, Share2, Music2, Bookmark, MoreHorizontal, Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export function Reel({ reel }: { reel: any }) {
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(reel.likes || 0)
    const [isPlaying, setIsPlaying] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkLike = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('likes')
                .select('*')
                .eq('reel_id', reel.id)
                .eq('user_id', user.id)
                .maybeSingle()

            if (data) setLiked(true)
        }
        checkLike()
    }, [reel.id])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => { })
                    setIsPlaying(true)
                } else {
                    videoRef.current?.pause()
                    setIsPlaying(false)
                }
            },
            { threshold: 0.6 } // Play only when 60% visible
        )

        if (videoRef.current) {
            observer.observe(videoRef.current)
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current)
            }
        }
    }, [])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleLike = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return // Redirect to login in real app

        const newLiked = !liked
        setLiked(newLiked)
        setLikesCount((prev: number) => newLiked ? prev + 1 : Math.max(0, prev - 1))

        try {
            if (newLiked) {
                await supabase.from('likes').insert({ reel_id: reel.id, user_id: user.id })
            } else {
                await supabase.from('likes').delete().eq('reel_id', reel.id).eq('user_id', user.id)
            }
        } catch (err) {
            console.error('Like error', err)
            // Revert
            setLiked(!newLiked)
            setLikesCount((prev: number) => !newLiked ? prev + 1 : Math.max(0, prev - 1))
        }
    }

    return (
        <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden">
            {/* Immersive Video Layer */}
            <div className="absolute inset-0 bg-black cursor-pointer" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={reel.videoPlaceholder}
                    className="w-full h-full object-contain max-w-full max-h-full"
                    autoPlay
                    loop
                    playsInline
                // muted // Unmute for better experience if browser allows, otherwise user must interact
                />
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-16 h-16 text-white/80" />
                    </div>
                )}
            </div>

            {/* Content Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 flex flex-col justify-end p-6 pb-24 md:pb-12 pointer-events-none">
                <div className="flex justify-between items-end max-w-lg w-full mx-auto pointer-events-auto">
                    {/* Caption & Creator Info */}
                    <div className="flex-1 pr-12 mb-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-2xl cursor-pointer"
                            >
                                <img src={reel.avatar} alt={reel.username} className="w-full h-full object-cover" />
                            </motion.div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-black text-lg drop-shadow-lg flex items-center cursor-pointer hover:underline">
                                    {reel.username}
                                </h3>
                            </div>
                            <button className="ml-4 bg-white/20 hover:bg-white/40 text-white px-4 py-1.5 rounded-xl text-xs font-black backdrop-blur-xl border border-white/20 transition-all active:scale-95 shadow-lg">
                                Follow
                            </button>
                        </div>

                        <p className="text-white text-base mb-6 line-clamp-3 leading-relaxed drop-shadow-md font-medium">
                            {reel.description}
                        </p>

                        <div className="flex items-center space-x-3 bg-black/30 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                            <Music2 className="w-4 h-4 text-white animate-pulse" />
                            <div className="overflow-hidden w-32">
                                <motion.span
                                    animate={{ x: [0, -100] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="text-white text-xs whitespace-nowrap font-bold"
                                >
                                    {reel.music || 'Original Audio - Eziogram Sound System'}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* Right-side Action Menu */}
                    <div className="flex flex-col items-center space-y-7 pb-4">
                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileTap={{ scale: 1.5 }}
                                onClick={handleLike}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all ${liked ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <Heart className={`w-8 h-8 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-white'}`} />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">{likesCount}</span>
                        </div>

                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all"
                            >
                                <MessageCircle className="w-8 h-8 text-white" />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">0</span>
                        </div>

                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileTap={{ scale: 1.5 }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all bg-white/10 hover:bg-white/20`}
                            >
                                <Bookmark className={`w-7 h-7 text-white`} />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">Save</span>
                        </div>

                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white mt-4">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-full ring-4 ring-white/20 overflow-hidden shadow-2xl mt-4 border-2 border-white/40"
                        >
                            <img src={reel.avatar} className="w-full h-full object-cover" alt="Vinyl" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pointer-events-none">
                <span className="text-white font-black text-2xl tracking-tighter italic">Reels</span>
                <div className="w-10 h-10" />
            </div>
        </div>
    )
}
