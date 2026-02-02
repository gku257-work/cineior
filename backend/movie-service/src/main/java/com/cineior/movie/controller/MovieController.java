package com.cineior.movie.controller;

import com.cineior.movie.dto.MovieDto;
import com.cineior.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    private static final Map<String, Integer> GENRE_MAP = Map.ofEntries(
            Map.entry("action", 28),
            Map.entry("adventure", 12),
            Map.entry("animation", 16),
            Map.entry("comedy", 35),
            Map.entry("crime", 80),
            Map.entry("documentary", 99),
            Map.entry("drama", 18),
            Map.entry("family", 10751),
            Map.entry("fantasy", 14),
            Map.entry("history", 36),
            Map.entry("horror", 27),
            Map.entry("music", 10402),
            Map.entry("mystery", 9648),
            Map.entry("romance", 10749),
            Map.entry("science-fiction", 878),
            Map.entry("sci-fi", 878),
            Map.entry("thriller", 53),
            Map.entry("war", 10752),
            Map.entry("western", 37));

    @GetMapping("/search")
    public ResponseEntity<List<MovieDto.TmdbSearchResult>> searchMovies(@RequestParam String q) {
        return ResponseEntity.ok(movieService.searchMovies(q));
    }

    @GetMapping("/discover")
    public ResponseEntity<List<MovieDto.MovieResponse>> discoverMovies(
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getDiscoverMovies(page));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<MovieDto.MovieResponse>> getTopRated(
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(movieService.getTopRatedMovies(page));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<MovieDto.MovieResponse>> getTrending() {
        return ResponseEntity.ok(movieService.getTrendingMovies());
    }

    @GetMapping("/genre/{slug}")
    public ResponseEntity<List<MovieDto.MovieResponse>> getByGenre(
            @PathVariable String slug,
            @RequestParam(defaultValue = "1") int page) {
        Integer genreId = GENRE_MAP.get(slug.toLowerCase());
        if (genreId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(movieService.getMoviesByGenre(genreId, page));
    }

    @GetMapping("/{tmdbId}/details")
    public ResponseEntity<MovieDto.TmdbMovieDetails> getMovieDetails(@PathVariable Long tmdbId) {
        return ResponseEntity.ok(movieService.getMovieDetails(tmdbId));
    }

    @PostMapping("/save/{tmdbId}")
    public ResponseEntity<MovieDto.MovieResponse> saveMovie(@PathVariable Long tmdbId) {
        return ResponseEntity.ok(movieService.saveMovieFromTmdb(tmdbId));
    }

    @GetMapping("/internal/{id}")
    public ResponseEntity<MovieDto.MovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }
}
