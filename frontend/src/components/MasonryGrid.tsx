'use client';

import Masonry from 'react-masonry-css';
import { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MasonryGridProps {
    movies: Movie[];
    onMovieClick?: (movie: Movie) => void;
}

export default function MasonryGrid({ movies, onMovieClick }: MasonryGridProps) {
    const breakpointColumns = {
        default: 5,
        1536: 5,
        1280: 4,
        1024: 3,
        768: 2,
        640: 2,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
        >
            {movies.map((movie, index) => (
                <div key={movie.tmdbId || index} className="mb-4">
                    <MovieCard
                        movie={movie}
                        onClick={() => onMovieClick?.(movie)}
                    />
                </div>
            ))}
        </Masonry>
    );
}
