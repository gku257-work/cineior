'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import MovieCard from '@/components/MovieCard';

const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: false });
import { useAuth } from '@/context/AuthContext';
import { userMovieApi } from '@/lib/api';
import { UserMovie } from '@/types';
import { EyeIcon, BookmarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type TabType = 'all' | 'WATCHED' | 'WATCHLIST' | 'FAVORITE';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All', icon: BookmarkIcon },
    { id: 'WATCHED', label: 'Watched', icon: EyeIcon },
    { id: 'WATCHLIST', label: 'Watchlist', icon: BookmarkIcon },
    { id: 'FAVORITE', label: 'Favorites', icon: HeartIcon },
];

export default function MyListPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [movies, setMovies] = useState<UserMovie[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserMovies = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const status = activeTab === 'all' ? undefined : activeTab;
                const data = await userMovieApi.getAll(status);
                setMovies(data);
            } catch (error) {
                console.error('Failed to fetch user movies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserMovies();
    }, [user, activeTab]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
                <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen" style={{ background: 'var(--background)' }}>
                <Navigation />
                <main className="pt-28 md:pt-20 px-4 sm:px-6 max-w-7xl mx-auto pb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-20"
                    >
                        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                            Sign in to view your list
                        </h1>
                        <p className="mb-8" style={{ color: 'var(--muted)' }}>
                            Track movies you&apos;ve watched, want to watch, and favorites
                        </p>
                        <Link href="/login" className="btn-primary">
                            Sign In
                        </Link>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Navigation />

            <main className="pt-28 md:pt-20 px-4 sm:px-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                        My List
                    </h1>
                    <p style={{ color: 'var(--muted)' }}>
                        Your personal cinema journal
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                            style={{
                                background: activeTab === id ? 'var(--accent)' : 'var(--surface)',
                                color: activeTab === id ? '#0a0a0a' : 'var(--foreground)',
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Movies Grid */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                        >
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
                            ))}
                        </motion.div>
                    ) : movies.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <p className="text-lg mb-4" style={{ color: 'var(--muted)' }}>
                                No movies in this list yet
                            </p>
                            <Link href="/discover" className="btn-primary">
                                Discover Movies
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                        >
                            {movies.map((movie, index) => (
                                <motion.div
                                    key={movie.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <MovieCard
                                        movie={movie}
                                        userStatus={movie.userStatus}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
