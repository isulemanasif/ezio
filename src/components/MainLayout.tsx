import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Persistent */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col pt-16">
                <Navbar />
                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto flex gap-8">
                        {children}

                        {/* Right Sidebar - Suggestions (Facebook/Instagram style) */}
                        <div className="hidden lg:block w-80 sticky top-24 h-fit">
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase">Suggested for you</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=friend_${i}`}
                                                        className="w-8 h-8 rounded-full"
                                                        alt="avatar"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">friend_{i}</p>
                                                        <p className="text-[10px] text-gray-500">Popular on Eziogram</p>
                                                    </div>
                                                </div>
                                                <button className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">Follow</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-[10px] text-gray-300 px-2 space-x-2">
                                    <span>About</span>
                                    <span>Help</span>
                                    <span>Press</span>
                                    <span>API</span>
                                    <span>Jobs</span>
                                    <span>Privacy</span>
                                    <span>Terms</span>
                                </div>
                                <p className="text-[10px] text-gray-300 px-2 font-bold uppercase italic">© 2026 EZIOGRAM FROM ANTIGRAVITY</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
