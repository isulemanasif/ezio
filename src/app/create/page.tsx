"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { PlusSquare, PlaySquare, Image as ImageIcon, Send, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreatePage() {
    const [type, setType] = useState<'post' | 'reel' | 'story'>('post')
    const [url, setUrl] = useState('')
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                await supabase.from('profiles').upsert({
                    id: user.id,
                    username: user.email?.split('@')[0],
                    full_name: user.user_metadata?.full_name || 'Eziogram User',
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' })
            }
        }
        getUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        let table = ''
        let data: any = { user_id: user.id, image_url: url }

        if (type === 'post') {
            table = 'posts'
            data.caption = caption
        } else if (type === 'reel') {
            table = 'reels'
            data = { user_id: user.id, video_url: url, description: caption }
        } else {
            table = 'stories'
        }

        const { error } = await supabase.from(table).insert([data])

        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            router.push(type === 'post' ? '/' : type === 'reel' ? '/reels' : '/')
            router.refresh()
        }
    }

    return (
        <MainLayout>
            <div className="max-w-2xl w-full mx-auto py-8 px-4">
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Create New Content</h1>
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-2 bg-gray-50 flex space-x-2">
                        {[
                            { id: 'post', label: 'Feed Post', icon: ImageIcon, color: 'blue' },
                            { id: 'reel', label: 'Reel', icon: PlaySquare, color: 'purple' },
                            { id: 'story', label: 'Story', icon: PlusSquare, color: 'pink' }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setType(btn.id as any)}
                                className={`flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${type === btn.id
                                    ? `bg-white shadow-md text-${btn.color}-600`
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <btn.icon className="w-4 h-4" />
                                <span>{btn.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {/* Preview Area */}
                        {url && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-square w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden shadow-inner bg-gray-100 border-4 border-white ring-1 ring-gray-100"
                            >
                                {type === 'reel' ? (
                                    <video src={url} className="w-full h-full object-cover" autoPlay muted loop />
                                ) : (
                                    <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                )}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Media URL</label>
                                <input
                                    type="url"
                                    placeholder={type === 'post' || type === 'story' ? "Image Link (e.g. Unsplash)" : "Video Link (e.g. .mp4 file)"}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                            </div>

                            {type !== 'story' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Caption / Description</label>
                                    <textarea
                                        placeholder="Add a catchy caption..."
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:bg-white outline-none transition-all resize-none h-32 placeholder:text-gray-300 font-medium"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !url}
                            className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:active:scale-100 flex items-center justify-center space-x-3 ${type === 'post' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-200' :
                                type === 'reel' ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-purple-200' :
                                    'bg-gradient-to-r from-pink-500 to-orange-500 shadow-pink-200'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    <span>Share to {type === 'post' ? 'Feed' : type === 'reel' ? 'Reels' : 'Story'}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}


