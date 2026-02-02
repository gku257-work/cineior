'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import MasonryGrid from '@/components/MasonryGrid';

const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: false });
import { movieApi } from '@/lib/api';
import { Movie } from '@/types';

export default function DiscoverPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = useCallback(async (pageNum: number) => {
        try {
            const data = await movieApi.discover(pageNum);
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setMovies(prev => pageNum === 1 ? data : [...prev, ...data]);
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMovies(1);
    }, [fetchMovies]);

    useEffect(() => {
        const handleScroll = () => {
            if (isLoading || !hasMore) return;

            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 500) {
                setIsLoading(true);
                setPage(prev => prev + 1);
                fetchMovies(page + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, isLoading, hasMore, fetchMovies]);

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Navigation />

            {/* Main Content */}
            <main className="pt-28 md:pt-20 px-4 sm:px-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                        Discover
                    </h1>
                    <p style={{ color: 'var(--muted)' }}>
                        Explore the world of cinema
                    </p>
                </motion.div>

                {/* Movie Grid */}
                {isLoading && movies.length === 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
                        ))}
                    </div>
                ) : (
                    <MasonryGrid movies={movies} />
                )}

                {/* Loading More */}
                {isLoading && movies.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <div
                            className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                        />
                    </div>
                )}

                {/* No More */}
                {!hasMore && (
                    <p className="text-center mt-8" style={{ color: 'var(--muted)' }}>
                        You&apos;ve reached the end ✨
                    </p>
                )}
            </main>
        </div>
    );
}
