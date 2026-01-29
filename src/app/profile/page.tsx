"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { Settings, Grid, Bookmark, Tag, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EditProfileModal } from '@/components/EditProfileModal'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('posts')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUser(user)

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setProfile(profileData)

            // Fetch User Posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            setPosts(postsData || [])
            setLoading(false)
        }

        fetchProfileData()
    }, [])

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-16 mb-12">
                    <div className="relative mb-6 md:mb-0">
                        <div className="w-32 md:w-40 h-32 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[3px]">
                            <div className="w-full h-full rounded-full bg-white p-[3px]">
                                <img
                                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                            <h2 className="text-xl font-light text-gray-900">{profile?.username || user?.email?.split('@')[0]}</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Edit Profile
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Settings className="w-5 h-5 text-gray-700" />
                                    </button>

                                    <AnimatePresence>
                                        {isSettingsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                <div className="flex flex-col py-1">
                                                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium text-gray-700">
                                                        Account Settings
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium text-gray-700">
                                                        Privacy & Security
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors font-medium text-gray-700">
                                                        Saved Posts
                                                    </button>
                                                    <div className="h-[1px] bg-gray-100 my-1" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors"
                                                    >
                                                        Log Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start space-x-8 mb-6">
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">{posts.length}</span>
                                <span className="ml-1 text-gray-600">posts</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">0</span>
                                <span className="ml-1 text-gray-600">followers</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">0</span>
                                <span className="ml-1 text-gray-600">following</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-gray-900">{profile?.full_name || 'Ezio User'}</h1>
                            <p className="text-gray-800 text-sm mt-1 whitespace-pre-line">
                                {profile?.bio || 'No bio yet. Click Edit Profile to add one! ✨'}
                            </p>
                            {profile?.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-900 text-sm font-bold hover:underline mt-1 block"
                                >
                                    {profile.website.replace('https://', '').replace('http://', '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-200">
                    <div className="flex justify-center space-x-12 uppercase tracking-widest text-xs font-semibold">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center space-x-2 py-4 border-t transition-all ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            <Grid className="w-4 h-4" />
                            <span>Posts</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex items-center space-x-2 py-4 border-t transition-all ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            <Bookmark className="w-4 h-4" />
                            <span>Saved</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('tagged')}
                            className={`flex items-center space-x-2 py-4 border-t transition-all ${activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            <Tag className="w-4 h-4" />
                            <span>Tagged</span>
                        </button>
                    </div>

                    {/* Posts Grid */}
                    {activeTab === 'posts' && (
                        <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4">
                            {posts.length === 0 ? (
                                <div className="col-span-3 py-20 text-center">
                                    <p className="text-gray-400">Share your first post!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden rounded-lg shadow-sm"
                                    >
                                        <img
                                            src={post.image_url}
                                            alt="Post content"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-bold">
                                            <div className="flex items-center space-x-1">
                                                <span>❤️</span>
                                                <span>{post.likes_count}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>💬</span>
                                                <span>0</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onUpdate={(newProfile) => setProfile(newProfile)}
            />
        </MainLayout>
    )
}
