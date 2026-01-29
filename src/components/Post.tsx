"use client"

import { MessageSquare, Heart, Share2, MoreHorizontal, Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'

export function Post({ post }: { post: any }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-white p-[1.5px]">
                            <img src={post.avatar} alt={post.username} className="w-full h-full rounded-full" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{post.username}</h3>
                        <p className="text-xs text-gray-500">{post.location || 'Original content'}</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Post Image/Content */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <motion.button whileTap={{ scale: 1.2 }}>
                            <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 1.2 }}>
                            <MessageSquare className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 1.2 }}>
                            <Share2 className="w-6 h-6 text-gray-700 hover:text-green-500 transition-colors" />
                        </motion.button>
                    </div>
                    <button>
                        <Bookmark className="w-6 h-6 text-gray-700 hover:text-black transition-colors" />
                    </button>
                </div>

                {/* Likes & Caption */}
                <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900">{post.likes.toLocaleString()} likes</p>
                    <p className="text-sm text-gray-800">
                        <span className="font-bold mr-2">{post.username}</span>
                        {post.caption}
                    </p>
                    <button className="text-sm text-gray-500 hover:underline">View all {post.comments} comments</button>
                    <p className="text-[10px] text-gray-400 uppercase mt-2">{post.time}</p>
                </div>
            </div>

            {/* Comment Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center space-x-3">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 text-sm outline-none bg-transparent"
                />
                <button className="text-blue-500 font-semibold text-sm disabled:opacity-50">Post</button>
            </div>
        </div>
    )
}
