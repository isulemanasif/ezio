"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { Heart, UserPlus, MessageCircle, Star, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data for notifications until we have a real table
        const mockNotifications = [
            {
                id: 1,
                type: 'like',
                user: { username: 'travel_lover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=121' },
                content: 'liked your post.',
                time: '2h',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80'
            },
            {
                id: 2,
                type: 'follow',
                user: { username: 'tech_geek', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=125' },
                content: 'started following you.',
                time: '5h',
                isFollowing: false
            },
            {
                id: 3,
                type: 'comment',
                user: { username: 'foodie_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=130' },
                content: 'commented: "This looks amazing! 😍"',
                time: '1d',
                image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&q=80'
            },
            {
                id: 4,
                type: 'like',
                user: { username: 'nature_boy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=135' },
                content: 'liked your reel.',
                time: '2d',
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&q=80'
            }
        ]

        setTimeout(() => {
            setNotifications(mockNotifications)
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-8 text-gray-900 px-4">Notifications</h1>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No notifications yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    whileHover={{ backgroundColor: '#f9fafb' }}
                                    className="flex items-center justify-between p-4 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={notif.user.avatar}
                                                alt={notif.user.username}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${notif.type === 'like' ? 'bg-red-500' :
                                                    notif.type === 'follow' ? 'bg-blue-500' : 'bg-green-500'
                                                }`}>
                                                {notif.type === 'like' && <Heart className="w-2 h-2 text-white fill-current" />}
                                                {notif.type === 'follow' && <UserPlus className="w-2 h-2 text-white" />}
                                                {notif.type === 'comment' && <MessageCircle className="w-2 h-2 text-white fill-current" />}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-900 font-medium">
                                                <span className="font-bold mr-1">{notif.user.username}</span>
                                                {notif.content}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-0.5">{notif.time}</span>
                                        </div>
                                    </div>

                                    {notif.type === 'follow' ? (
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                                            Follow Back
                                        </button>
                                    ) : notif.image ? (
                                        <img
                                            src={notif.image}
                                            className="w-10 h-10 rounded-md object-cover shadow-sm border border-gray-100"
                                            alt="Post preview"
                                        />
                                    ) : null}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
