package com.cineior.movie.repository;

import com.cineior.movie.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbId(Long tmdbId);

    boolean existsByTmdbId(Long tmdbId);
}
