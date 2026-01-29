"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import { StoryBar } from '@/components/StoryBar'
import { Post } from '@/components/Post'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
                      *,
                      profiles (
                          username,
                          avatar_url
                      )
                  `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error("Supabase Post Fetch Error:", error.message, error.details, error.hint)
        } else {
          setPosts(data || [])
        }
      } catch (err) {
        console.error("Unexpected Post Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <MainLayout>
      <div className="max-w-[630px] w-full mx-auto lg:mx-0">
        <StoryBar />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">No posts yet. Be the first to share! 🚀</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={{
                ...post,
                username: post.profiles?.username || 'user',
                avatar: post.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=eziogram',
                likes: post.likes_count,
                comments: 0, // Mock for now
                time: new Date(post.created_at).toLocaleDateString(),
                image: post.image_url
              }} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
