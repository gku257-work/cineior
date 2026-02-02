'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import MasonryGrid from '@/components/MasonryGrid';

const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: false });
import { movieApi } from '@/lib/api';
import { Movie } from '@/types';
import { StarIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/solid';

type SectionType = 'top-rated' | 'trending';

const sections: { id: SectionType; label: string; icon: React.ElementType }[] = [
    { id: 'top-rated', label: 'Top Rated', icon: StarIcon },
    { id: 'trending', label: 'Trending', icon: FireIcon },
];

export default function TopMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [activeSection, setActiveSection] = useState<SectionType>('top-rated');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const data = activeSection === 'top-rated'
                    ? await movieApi.topRated()
                    : await movieApi.trending();
                setMovies(data);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [activeSection]);

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
                    <div className="flex items-center gap-3 mb-2">
                        <TrophyIcon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                        <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                            Top Movies
                        </h1>
                    </div>
                    <p style={{ color: 'var(--muted)' }}>
                        The finest cinema has to offer
                    </p>
                </motion.div>

                {/* Section Tabs */}
                <div className="flex gap-2 mb-8">
                    {sections.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                                background: activeSection === id ? 'var(--accent)' : 'var(--surface)',
                                color: activeSection === id ? '#0a0a0a' : 'var(--foreground)',
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Movies Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
                        ))}
                    </div>
                ) : (
                    <MasonryGrid movies={movies} />
                )}
            </main>
        </div>
    );
}
