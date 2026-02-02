'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { movieApi, getImageUrl } from '@/lib/api';
import { TmdbSearchResult } from '@/types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
    onSelect?: (movie: TmdbSearchResult) => void;
    placeholder?: string;
}

export default function SearchBar({ onSelect, placeholder = 'Search movies...' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TmdbSearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchMovies = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await movieApi.search(query);
                setResults(data || []);
                setIsOpen(true);
                setSelectedIndex(-1);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchMovies, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (movie: TmdbSearchResult) => {
        if (onSelect) {
            onSelect(movie);
        }
        setQuery('');
        setIsOpen(false);
        setResults([]);
    };

    const getYear = (dateStr?: string) => {
        if (!dateStr) return '';
        return dateStr.substring(0, 4);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            <div
                className="relative flex items-center glass rounded-xl overflow-hidden"
            >
                <MagnifyingGlassIcon
                    className="absolute left-4 w-5 h-5"
                    style={{ color: 'var(--muted)' }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full py-3 pl-12 pr-10 bg-transparent border-none outline-none"
                    style={{ color: 'var(--foreground)' }}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-4 p-1 rounded-full hover:opacity-70 transition-opacity"
                    >
                        <XMarkIcon className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 glass"
                        style={{ maxHeight: '400px', overflowY: 'auto' }}
                    >
                        {results.map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleSelect(movie)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className="flex items-center gap-3 p-3 cursor-pointer transition-colors"
                                style={{
                                    background: selectedIndex === index ? 'var(--surface-hover)' : 'transparent'
                                }}
                            >
                                <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0">
                                    {movie.posterPath ? (
                                        <Image
                                            src={getImageUrl(movie.posterPath, 'w200') || ''}
                                            alt={movie.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{ background: 'var(--surface)' }}
                                        >
                                            <span className="text-xs">🎬</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className="font-medium text-sm line-clamp-1"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        {movie.title}
                                    </h4>
                                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                                        {getYear(movie.releaseDate)}
                                        {movie.voteAverage && ` • ⭐ ${movie.voteAverage.toFixed(1)}`}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                </div>
            )}
        </div>
    );
}
