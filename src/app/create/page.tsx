"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { PlusSquare, PlaySquare, Image as ImageIcon, Send, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreatePage() {
    const [type, setType] = useState<'post' | 'reel' | 'story'>('post')
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setPreviewUrl(URL.createObjectURL(selectedFile))
    }

    const uploadFile = async (): Promise<string | null> => {
        if (!file || !user) return null

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const bucket = 'posts'

        try {
            setUploading(true)
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName)

            return publicUrl
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error uploading file')
            return null
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !file) return

        setLoading(true)

        // 1. Upload File
        const publicUrl = await uploadFile()
        if (!publicUrl) {
            setLoading(false)
            return
        }

        // 2. Insert Record
        let table = ''
        let data: any = { user_id: user.id }

        if (type === 'post') {
            table = 'posts'
            data.image_url = publicUrl
            data.caption = caption
        } else if (type === 'reel') {
            table = 'reels'
            data.video_url = publicUrl
            data.description = caption
        } else if (type === 'story') {
            table = 'stories'
            data.image_url = publicUrl
        }

        const { error } = await supabase.from(table).insert([data])

        if (error) {
            console.error('Db Insert Error:', error)
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
                                onClick={() => {
                                    setType(btn.id as any)
                                    setFile(null)
                                    setPreviewUrl('')
                                }}
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
                        {/* File Upload Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${previewUrl ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    {previewUrl ? (
                                        <div className="relative w-full h-full p-2">
                                            {type === 'reel' ? (
                                                <video src={previewUrl} className="w-full h-full object-contain rounded-xl" controls />
                                            ) : (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                                                <p className="text-white font-bold">Click to change</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="mb-4 text-center">
                                                {type === 'reel' ? (
                                                    <PlaySquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                                ) : (
                                                    <div className="p-4 bg-blue-100 rounded-full mb-2">
                                                        <ImageIcon className="w-8 h-8 text-blue-500" />
                                                    </div>
                                                )}
                                                <p className="mb-2 text-sm text-gray-500 font-bold">
                                                    <span className="font-extrabold text-blue-500">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-400 uppercase font-black tracking-widest">
                                                    {type === 'reel' ? 'MP4, WebM (Max 50MB)' : 'SVG, PNG, JPG, GIF (Max 10MB)'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={type === 'reel' ? "video/*" : "image/*"}
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                        </div>

                        {type !== 'story' && (
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Caption / Description</label>
                                <textarea
                                    placeholder="Add a catchy caption..."
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:bg-white outline-none transition-all resize-none h-32 placeholder:text-gray-300 font-medium"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:active:scale-100 flex items-center justify-center space-x-3 ${type === 'post' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-200' :
                                type === 'reel' ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-purple-200' :
                                    'bg-gradient-to-r from-pink-500 to-orange-500 shadow-pink-200'
                                }`}
                        >
                            {loading || uploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>{uploading ? 'Uploading Media...' : 'Creating Post...'}</span>
                                </>
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


