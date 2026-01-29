"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export function EditProfileModal({
    isOpen,
    onClose,
    profile,
    onUpdate
}: {
    isOpen: boolean,
    onClose: () => void,
    profile: any,
    onUpdate: (newProfile: any) => void
}) {
    const [username, setUsername] = useState(profile?.username || '')
    const [fullName, setFullName] = useState(profile?.full_name || '')
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const [bio, setBio] = useState(profile?.bio || '')
    const [website, setWebsite] = useState(profile?.website || '')
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)

            // Auto-save to database to avoid confusion
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ avatar_url: publicUrl })
                    .eq('id', user.id)
            }

        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('profiles')
            .update({
                username,
                full_name: fullName,
                avatar_url: avatarUrl,
                bio,
                website,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            alert(error.message)
        } else {
            onUpdate({ ...profile, username, full_name: fullName, avatar_url: avatarUrl, bio, website })
            onClose()
        }
        setLoading(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900">Edit Profile</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden shadow-lg relative">
                                        <img
                                            src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.id}`}
                                            className="w-full h-full object-cover"
                                            alt="Avatar"
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                <label className="mt-3 text-blue-500 text-sm font-bold hover:text-blue-600 transition-colors cursor-pointer">
                                    {uploading ? 'Uploading...' : 'Change Profile Photo'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Username</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl focus:bg-white outline-none transition-all font-medium"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl focus:bg-white outline-none transition-all font-medium"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Avatar URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl focus:bg-white outline-none transition-all font-medium"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="Link to your image..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Bio</label>
                                    <textarea
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl focus:bg-white outline-none transition-all font-medium resize-none h-24"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Website</label>
                                    <input
                                        type="url"
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl focus:bg-white outline-none transition-all font-medium"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
