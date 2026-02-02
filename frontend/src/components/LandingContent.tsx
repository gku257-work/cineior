'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function LandingContent() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)' }}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full opacity-5"
                    style={{
                        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0]
                    }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-5"
                    style={{
                        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                    <span className="text-2xl font-bold gradient-text">Cineior</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-colors hover:opacity-70"
                        style={{ color: 'var(--foreground)' }}
                    >
                        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                    <Link href="/login" className="btn-secondary text-sm">
                        Login
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                        <span className="gradient-text">Cineior</span>
                    </h1>
                    <p
                        className="text-xl md:text-2xl font-light italic mb-2"
                        style={{ color: 'var(--muted)' }}
                    >
                        de Bord Cinéma Personnalisé
                    </p>
                    <p
                        className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
                        style={{ color: 'var(--muted)' }}
                    >
                        Your personal cinema diary blended with an elegant,
                        Pinterest-style discovery experience. Just films and feeling.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/discover"
                        className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                    >
                        <PlayIcon className="w-5 h-5" />
                        Get Started
                    </Link>
                    <Link
                        href="/login"
                        className="btn-secondary text-lg px-8 py-4"
                    >
                        Login
                    </Link>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mt-16"
                >
                    {['Personal Journal', 'Movie Discovery', 'Watchlist', 'Cinema Aesthetics'].map((feature, i) => (
                        <motion.span
                            key={feature}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="px-4 py-2 rounded-full text-sm"
                            style={{
                                background: 'var(--surface)',
                                color: 'var(--muted)',
                                border: '1px solid var(--border)'
                            }}
                        >
                            {feature}
                        </motion.span>
                    ))}
                </motion.div>
            </main>

            {/* Decorative Film Strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-0 left-0 right-0 h-24 flex items-center overflow-hidden"
            >
                <motion.div
                    animate={{ x: [0, -200] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex gap-4 whitespace-nowrap"
                >
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-16 h-20 rounded"
                            style={{ background: 'var(--surface)' }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
