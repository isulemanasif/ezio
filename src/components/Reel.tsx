"use client"

import { Heart, MessageCircle, Share2, Music2, Bookmark, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function Reel({ reel }: { reel: any }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)

    return (
        <div className="relative h-screen w-full bg-black snap-start flex items-center justify-center overflow-hidden">
            {/* Immersive Video Layer */}
            <div className="absolute inset-0 bg-black">
                {reel.videoPlaceholder.endsWith('.mp4') ? (
                    <video
                        src={reel.videoPlaceholder}
                        className="w-full h-full object-cover opacity-90"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={reel.videoPlaceholder}
                        className="w-full h-full object-cover opacity-70"
                        alt="Reel content"
                    />
                )}
            </div>

            {/* Content Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 flex flex-col justify-end p-6 pb-24 md:pb-12">
                <div className="flex justify-between items-end max-w-lg w-full mx-auto">
                    {/* Caption & Creator Info */}
                    <div className="flex-1 pr-12 mb-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-2xl"
                            >
                                <img src={reel.avatar} alt={reel.username} className="w-full h-full object-cover" />
                            </motion.div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-black text-lg drop-shadow-lg flex items-center">
                                    {reel.username}
                                    <span className="ml-2 w-3 h-3 bg-blue-400 rounded-full border border-white flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white rounded-full" />
                                    </span>
                                </h3>
                                <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Sponsored</span>
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
                                    {reel.music || 'Original Audio - Ezio Sound System'}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* Right-side Action Menu (TikTok Vertical) */}
                    <div className="flex flex-col items-center space-y-7 pb-4">
                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileTap={{ scale: 1.5 }}
                                onClick={() => setLiked(!liked)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all ${liked ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <Heart className={`w-8 h-8 transition-colors ${liked ? 'text-red-500 fill-current' : 'text-white'}`} />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">{reel.likes}</span>
                        </div>

                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all"
                            >
                                <MessageCircle className="w-8 h-8 text-white" />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">4.2K</span>
                        </div>

                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button
                                whileTap={{ scale: 1.5 }}
                                onClick={() => setSaved(!saved)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all ${saved ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                <Bookmark className={`w-7 h-7 transition-colors ${saved ? 'text-yellow-500 fill-current' : 'text-white'}`} />
                            </motion.button>
                            <span className="text-white text-[11px] font-black mt-1.5 drop-shadow-md">Share</span>
                        </div>

                        <div className="flex flex-col items-center group cursor-pointer">
                            <motion.button className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-2xl transition-all">
                                <Share2 className="w-7 h-7 text-white" />
                            </motion.button>
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

            {/* Top Bar for Reels (Back & Title) */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50">
                <span className="text-white font-black text-2xl tracking-tighter italic">Reels</span>
                <div className="flex space-x-6 text-white/50 font-black text-sm uppercase tracking-widest">
                    <span className="text-white cursor-pointer underline underline-offset-8">Trending</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Following</span>
                </div>
                <div className="w-10 h-10" /> {/* Spacer */}
            </div>
        </div>
    )
}
