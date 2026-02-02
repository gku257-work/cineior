'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Movie } from '@/types';
import { getImageUrl } from '@/lib/api';
import { StarIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/solid';

interface MovieCardProps {
    movie: Movie;
    onClick?: () => void;
    userStatus?: 'WATCHED' | 'WATCHLIST' | 'FAVORITE';
}

export default function MovieCard({ movie, onClick, userStatus }: MovieCardProps) {
    const posterUrl = movie.posterUrl || getImageUrl(movie.posterUrl, 'w500');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className="relative group cursor-pointer rounded-xl overflow-hidden card-glow"
            style={{ background: 'var(--surface)' }}
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'var(--surface-hover)' }}
                    >
                        <span className="text-4xl opacity-30">🎬</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 cinematic-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                {userStatus && (
                    <div className="absolute top-3 right-3 z-10">
                        <div
                            className="p-2 rounded-full"
                            style={{ background: 'rgba(0,0,0,0.7)' }}
                        >
                            {userStatus === 'WATCHED' && <EyeIcon className="w-4 h-4 text-green-400" />}
                            {userStatus === 'WATCHLIST' && <EyeIcon className="w-4 h-4 text-blue-400" />}
                            {userStatus === 'FAVORITE' && <HeartIcon className="w-4 h-4 text-red-400" />}
                        </div>
                    </div>
                )}

                {/* Rating Badge */}
                {movie.rating && (
                    <div className="absolute top-3 left-3 z-10">
                        <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold"
                            style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--accent)' }}
                        >
                            <StarIcon className="w-3.5 h-3.5" />
                            <span>{movie.rating.toFixed(1)}</span>
                        </div>
                    </div>
                )}

                {/* Hover Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p
                        className="text-sm line-clamp-3 opacity-80"
                        style={{ color: '#ededed' }}
                    >
                        {movie.overview || 'No overview available'}
                    </p>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <h3
                    className="font-semibold text-base line-clamp-1 mb-1"
                    style={{ color: 'var(--foreground)' }}
                >
                    {movie.title}
                </h3>

                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                    {movie.year && <span>{movie.year}</span>}
                    {movie.genres && movie.genres.length > 0 && (
                        <>
                            <span>•</span>
                            <span className="line-clamp-1">{movie.genres.slice(0, 2).join(', ')}</span>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
