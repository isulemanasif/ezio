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
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('notifications')
                .select(`
                    id,
                    type,
                    content,
                    created_at,
                    read,
                    actor_id,
                    profiles:actor_id (username, avatar_url)
                `)
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false })

            // Transform data to match UI expected format
            const realNotifs = (data || []).map((n: any) => ({
                id: n.id,
                type: n.type,
                user: {
                    username: n.profiles?.username || 'User',
                    avatar: n.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.actor_id}`
                },
                content: n.content,
                time: new Date(n.created_at).toLocaleDateString(), // Simplification for now
                image: null, // We can add post image later if needed
                read: n.read
            }))

            setNotifications(realNotifs)
            setLoading(false)

            // Mark all as read
            if (data?.length) {
                await supabase
                    .from('notifications')
                    .update({ read: true })
                    .eq('recipient_id', user.id)
            }
        }

        fetchNotifications()
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
