"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { Grid, Loader2, UserPlus, UserCheck, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UserProfilePage() {
    const { id } = useParams()
    const [profile, setProfile] = useState<any>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return

            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)

            // 1. Fetch Profile
            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error("Profile fetch error", error)
                setLoading(false)
                return
            }
            setProfile(profileData)

            // 2. Fetch Posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false })
            setPosts(postsData || [])

            // 3. Check Follow Status
            if (user) {
                const { data: followData } = await supabase
                    .from('follows')
                    .select('*')
                    .eq('follower_id', user.id)
                    .eq('following_id', id)
                    .maybeSingle()
                setIsFollowing(!!followData)
            }

            setLoading(false)
        }

        fetchData()
    }, [id])

    const handleFollowToggle = async () => {
        if (!currentUser) return router.push('/login')

        const newFollowState = !isFollowing
        setIsFollowing(newFollowState) // Optimistic update

        // Update local counts optimistically
        setProfile((prev: any) => ({
            ...prev,
            followers_count: newFollowState ? (prev.followers_count || 0) + 1 : (prev.followers_count || 0) - 1
        }))

        try {
            if (newFollowState) {
                await supabase.from('follows').insert({
                    follower_id: currentUser.id,
                    following_id: id
                })
            } else {
                await supabase.from('follows').delete()
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', id)
            }
        } catch (err) {
            console.error(err)
            // Revert on error
            setIsFollowing(!newFollowState)
            setProfile((prev: any) => ({
                ...prev,
                followers_count: !newFollowState ? (prev.followers_count || 0) + 1 : (prev.followers_count || 0) - 1
            }))
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            </MainLayout>
        )
    }

    if (!profile) {
        return (
            <MainLayout>
                <div className="text-center py-20 text-gray-500">User not found.</div>
            </MainLayout>
        )
    }

    // Redirect to my own profile if I visit my own ID
    if (currentUser?.id === profile.id) {
        router.push('/profile')
        return null
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
                                    src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                                    alt={profile.username}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                            <h2 className="text-xl font-light text-gray-900">{profile.username}</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleFollowToggle}
                                    className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${isFollowing
                                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserCheck className="w-4 h-4" />
                                            <span>Following</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            <span>Follow</span>
                                        </>
                                    )}
                                </button>
                                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold transition-colors">
                                    Message
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start space-x-8 mb-6">
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">{posts.length}</span>
                                <span className="ml-1 text-gray-600">posts</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">{profile.followers_count || 0}</span>
                                <span className="ml-1 text-gray-600">followers</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="font-bold text-gray-900">{profile.following_count || 0}</span>
                                <span className="ml-1 text-gray-600">following</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="font-bold text-gray-900">{profile.full_name || 'Eziogram User'}</h1>
                            <p className="text-gray-800 text-sm mt-1 whitespace-pre-line">
                                {profile.bio || 'No bio yet.'}
                            </p>
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-900 text-sm font-bold hover:underline mt-1 block">
                                    {profile.website.replace('https://', '').replace('http://', '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest border-t border-black pt-4 -mt-4 text-black">
                            <Grid className="w-4 h-4" />
                            <span>Posts</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 md:gap-8">
                        {posts.length === 0 ? (
                            <div className="col-span-3 py-20 text-center">
                                <p className="text-gray-400">No posts yet.</p>
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
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
