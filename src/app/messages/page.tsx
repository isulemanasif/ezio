"use client"

import { useState } from 'react'
import MainLayout from '@/components/MainLayout'
import { Search, Phone, Video, Info, Send, Smile, Image as ImageIcon, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const MOCK_CHATS = [
    { id: 1, name: 'Suleman Asif', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suleman', lastMsg: 'Eziogram is looking great! 🔥', time: '10m', online: true },
    { id: 2, name: 'Google Antigravity', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cortex', lastMsg: 'How can I assist you today?', time: '1h', online: true },
    { id: 3, name: 'Elon Musk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elon', lastMsg: 'Need to talk about X integration.', time: '2h', online: false },
    { id: 4, name: 'Zuck', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zuck', lastMsg: 'Threads did it first lol', time: '5h', online: false },
]

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<any>(MOCK_CHATS[0])
    const [message, setMessage] = useState('')

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-white border border-gray-200 rounded-3xl overflow-hidden flex shadow-2xl">
                {/* Chat List Sidebar */}
                <div className="w-80 border-r border-gray-100 flex flex-col h-full bg-gray-50/30">
                    <div className="p-6 border-b border-gray-50 bg-white">
                        <h1 className="text-xl font-black text-gray-900 mb-4">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {MOCK_CHATS.map((chat) => (
                            <motion.div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                whileHover={{ backgroundColor: '#f9fafb' }}
                                className={`flex items-center space-x-4 p-4 cursor-pointer transition-all ${selectedChat?.id === chat.id ? 'bg-white border-l-4 border-blue-500 shadow-sm' : ''
                                    }`}
                            >
                                <div className="relative">
                                    <img src={chat.avatar} className="w-12 h-12 rounded-full" alt={chat.name} />
                                    {chat.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{chat.name}</h3>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">{chat.lastMsg}</p>
                                </div>
                                <span className="text-[10px] text-gray-300 font-bold">{chat.time}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Window */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                                <div className="flex items-center space-x-3">
                                    <img src={selectedChat.avatar} className="w-10 h-10 rounded-full" alt={selectedChat.name} />
                                    <div>
                                        <h2 className="text-sm font-black text-gray-900 leading-none">{selectedChat.name}</h2>
                                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Online now</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                        <Info className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-sm">
                                        <p className="text-sm text-gray-800">{selectedChat.lastMsg}</p>
                                        <span className="text-[10px] text-gray-300 mt-2 block">Sent at {selectedChat.time}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-100 max-w-sm">
                                        <p className="text-sm text-white">This UI looks amazing! Good job Eziogram team. 🚀</p>
                                        <span className="text-[10px] text-blue-200 mt-2 block">Just now</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 bg-white border-t border-gray-100">
                                <div className="flex items-center space-x-4 bg-gray-100 rounded-3xl px-6 py-1 pr-1">
                                    <Smile className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                                    <ImageIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 py-3 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 font-medium"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <button className="bg-blue-600 p-2.5 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle className="w-10 h-10 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Your Messages</h2>
                            <p className="text-gray-400 mt-2 max-w-xs">Send private photos and messages to a friend or group.</p>
                            <button className="mt-6 bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-blue-600 transition-all">
                                Send Message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
