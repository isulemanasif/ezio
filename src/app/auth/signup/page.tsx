"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EzioLogo } from '@/components/EzioLogo'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white border border-gray-300 p-10 flex flex-col items-center space-y-6 text-center">
                    <EzioLogo size={60} />
                    <h2 className="text-2xl font-bold text-green-600">Signup Successful!</h2>
                    <p className="text-gray-600">
                        Your account has been created successfully.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm transition hover:bg-blue-600"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-gray-300 p-10 flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <EzioLogo size={60} />
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 italic">Ezio</h1>
                    <p className="text-gray-500 font-semibold text-center mt-2">
                        Sign up to see photos and videos from your friends.
                    </p>
                </div>

                <form onSubmit={handleSignup} className="w-full space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                    <p className="text-[10px] text-gray-400 text-center px-2">
                        By signing up, you agree to our Terms, Data Policy and Cookies Policy.
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm transition hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-sm text-center font-medium">{error}</p>
                )}
            </div>

            <div className="max-w-md w-full bg-white border border-gray-300 p-6 mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Have an account?{' '}
                    <Link href="/auth/login" className="text-blue-500 font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
