"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EziogramLogo } from '@/components/EziogramLogo'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-gray-300 p-10 flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center mb-8">
                    <EziogramLogo size={60} />
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 italic">Eziogram</h1>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                )}

                <div className="flex items-center w-full my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-xs text-gray-400 font-semibold uppercase">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <button className="text-blue-900 text-sm font-semibold hover:underline">
                    Forgot password?
                </button>
            </div>

            <div className="max-w-md w-full bg-white border border-gray-300 p-6 mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="text-blue-500 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
