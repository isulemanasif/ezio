"use client"

import { MessageSquare, Heart, Share2, MoreHorizontal, Bookmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export function Post({ post }: { post: any }) {
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(post.likes || 0)
    const [comments, setComments] = useState<any[]>([])
    const [commentText, setCommentText] = useState('')
    const [isCommenting, setIsCommenting] = useState(false)
    const [authorAvatar, setAuthorAvatar] = useState(post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user')
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Author Profile (Correction for Join issues)
            const { data: authorData } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', post.user_id)
                .maybeSingle()

            if (authorData?.avatar_url) {
                setAuthorAvatar(authorData.avatar_url)
            }

            const { data: { user } } = await supabase.auth.getUser()

            // Check Like Status
            if (user) {
                const { data } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)
                    .maybeSingle()

                setIsLiked(!!data)
            }

            // Fetch Comments
            const { data: commentData } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles (username)
                `)
                .eq('post_id', post.id)
                .order('created_at', { ascending: true })

            setComments(commentData || [])
        }
        fetchData()
    }, [post.id, post.user_id])

    const handleLike = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Optimistic UI update
            const newLikedState = !isLiked
            setIsLiked(newLikedState)
            setLikesCount((prev: number) => newLikedState ? prev + 1 : Math.max(0, prev - 1))

            if (newLikedState) {
                await supabase.from('likes').insert({ post_id: post.id, user_id: user.id })
            } else {
                await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id)
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // Revert on error
            setIsLiked(!isLiked)
            setLikesCount((prev: number) => isLiked ? prev + 1 : Math.max(0, prev - 1))
        }
    }

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim() || isCommenting) return

        try {
            setIsCommenting(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: newComment, error } = await supabase
                .from('comments')
                .insert({
                    post_id: post.id,
                    user_id: user.id,
                    content: commentText.trim()
                })
                .select(`
                    *,
                    profiles (username)
                `)
                .single()

            if (error) throw error

            setComments([...comments, newComment])
            setCommentText('')
        } catch (error) {
            console.error('Error posting comment:', error)
        } finally {
            setIsCommenting(false)
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <Link href={`/profile/${post.user_id}`}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px] cursor-pointer">
                            <div className="w-full h-full rounded-full bg-white p-[1.5px]">
                                <img src={authorAvatar} alt={post.username} className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>
                    </Link>
                    <div>
                        <Link href={`/profile/${post.user_id}`}>
                            <h3 className="text-sm font-bold text-gray-900 hover:underline cursor-pointer">{post.username}</h3>
                        </Link>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{post.location || 'Original content'}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-full transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Post Image/Content */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
            </div>

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-5">
                        <motion.button
                            whileTap={{ scale: 1.4 }}
                            onClick={handleLike}
                            className="group"
                        >
                            <Heart
                                className={`w-7 h-7 transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-800 hover:text-red-500 group-hover:scale-110'}`}
                            />
                        </motion.button>
                        <motion.button whileTap={{ scale: 1.2 }}>
                            <MessageSquare className="w-7 h-7 text-gray-800 hover:text-blue-500 transition-colors" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 1.2 }}>
                            <Share2 className="w-7 h-7 text-gray-800 hover:text-green-500 transition-colors" />
                        </motion.button>
                    </div>
                    <button className="group">
                        <Bookmark className="w-7 h-7 text-gray-800 group-hover:fill-black transition-all" />
                    </button>
                </div>

                {/* Likes & Caption */}
                <div className="space-y-2">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={likesCount}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-extrabold text-gray-900"
                        >
                            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
                        </motion.p>
                    </AnimatePresence>
                    <p className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-bold mr-2 text-gray-900">{post.username}</span>
                        {post.caption}
                    </p>

                    {/* Real Comments List */}
                    {comments.length > 0 && (
                        <div className="space-y-1 mt-2">
                            {comments.slice(-2).map((comment) => (
                                <p key={comment.id} className="text-sm text-gray-800">
                                    <span className="font-bold mr-2">{comment.profiles?.username}</span>
                                    {comment.content}
                                </p>
                            ))}
                            {comments.length > 2 && (
                                <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
                                    View all {comments.length} comments
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-2">{post.time}</p>
                </div>
            </div>

            {/* Comment Input */}
            <form
                onSubmit={handleComment}
                className="px-4 py-4 border-t border-gray-50 flex items-center space-x-3 group focus-within:bg-gray-50/50 transition-colors"
            >
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-300 font-medium"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!commentText.trim() || isCommenting}
                    className="text-blue-500 font-bold text-sm disabled:opacity-30 hover:text-blue-600 transition-colors"
                >
                    {isCommenting ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    )
}
