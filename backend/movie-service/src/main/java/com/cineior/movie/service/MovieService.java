package com.cineior.movie.service;

import com.cineior.movie.dto.MovieDto;
import com.cineior.movie.model.Movie;
import com.cineior.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    @Value("${tmdb.api.base-url}")
    private String tmdbBaseUrl;

    @Value("${tmdb.image.base-url}")
    private String tmdbImageBaseUrl;

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + tmdbApiKey);
        headers.set("accept", "application/json");
        return headers;
    }

    public List<MovieDto.TmdbSearchResult> searchMovies(String query) {
        String url = tmdbBaseUrl + "/search/movie?query=" + query + "&language=en-US&page=1";

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        @SuppressWarnings("unchecked")
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("results")) {
            return List.of();
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

        return results.stream()
                .limit(10)
                .map(this::mapToSearchResult)
                .collect(Collectors.toList());
    }

    public MovieDto.TmdbMovieDetails getMovieDetails(Long tmdbId) {
        String url = tmdbBaseUrl + "/movie/" + tmdbId + "?append_to_response=credits";

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<MovieDto.TmdbMovieDetails> response = restTemplate.exchange(url, HttpMethod.GET, entity,
                MovieDto.TmdbMovieDetails.class);
        return response.getBody();
    }

    public List<MovieDto.MovieResponse> getDiscoverMovies(int page) {
        String url = tmdbBaseUrl + "/discover/movie?sort_by=popularity.desc&page=" + page;
        return fetchAndConvertMovies(url);
    }

    public List<MovieDto.MovieResponse> getTopRatedMovies(int page) {
        String url = tmdbBaseUrl + "/movie/top_rated?language=en-US&page=" + page;
        return fetchAndConvertMovies(url);
    }

    public List<MovieDto.MovieResponse> getTrendingMovies() {
        String url = tmdbBaseUrl + "/trending/movie/week";
        return fetchAndConvertMovies(url);
    }

    public List<MovieDto.MovieResponse> getMoviesByGenre(int genreId, int page) {
        String url = tmdbBaseUrl + "/discover/movie?with_genres=" + genreId + "&page=" + page;
        return fetchAndConvertMovies(url);
    }

    public MovieDto.MovieResponse saveMovieFromTmdb(Long tmdbId) {
        if (movieRepository.existsByTmdbId(tmdbId)) {
            Movie existing = movieRepository.findByTmdbId(tmdbId).orElseThrow();
            return MovieDto.MovieResponse.from(existing);
        }

        MovieDto.TmdbMovieDetails details = getMovieDetails(tmdbId);

        String director = details.getCredits() != null && details.getCredits().getCrew() != null
                ? details.getCredits().getCrew().stream()
                        .filter(c -> "Director".equals(c.getJob()))
                        .map(MovieDto.TmdbMovieDetails.CrewMember::getName)
                        .findFirst()
                        .orElse(null)
                : null;

        String castStr = details.getCredits() != null && details.getCredits().getCast() != null
                ? details.getCredits().getCast().stream()
                        .limit(5)
                        .map(MovieDto.TmdbMovieDetails.CastMember::getName)
                        .collect(Collectors.joining(", "))
                : null;

        Movie movie = Movie.builder()
                .tmdbId(tmdbId)
                .title(details.getTitle())
                .year(details.getReleaseDate() != null && details.getReleaseDate().length() >= 4
                        ? Integer.parseInt(details.getReleaseDate().substring(0, 4))
                        : null)
                .genres(details.getGenres() != null
                        ? details.getGenres().stream().map(MovieDto.TmdbMovieDetails.Genre::getName)
                                .collect(Collectors.toList())
                        : List.of())
                .runtime(details.getRuntime())
                .language(details.getOriginalLanguage())
                .overview(details.getOverview())
                .posterUrl(
                        details.getPosterPath() != null ? tmdbImageBaseUrl + "/w500" + details.getPosterPath() : null)
                .backdropUrl(
                        details.getBackdropPath() != null ? tmdbImageBaseUrl + "/original" + details.getBackdropPath()
                                : null)
                .rating(details.getVoteAverage())
                .director(director)
                .actors(castStr)
                .build();

        movie = movieRepository.save(movie);
        return MovieDto.MovieResponse.from(movie);
    }

    public MovieDto.MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return MovieDto.MovieResponse.from(movie);
    }

    private List<MovieDto.MovieResponse> fetchAndConvertMovies(String url) {
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        @SuppressWarnings("unchecked")
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("results")) {
            return List.of();
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");

        return results.stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }

    private MovieDto.TmdbSearchResult mapToSearchResult(Map<String, Object> data) {
        MovieDto.TmdbSearchResult result = new MovieDto.TmdbSearchResult();
        result.setId(((Number) data.get("id")).longValue());
        result.setTitle((String) data.get("title"));
        result.setOriginalTitle((String) data.get("original_title"));
        result.setOverview((String) data.get("overview"));
        result.setPosterPath((String) data.get("poster_path"));
        result.setBackdropPath((String) data.get("backdrop_path"));
        result.setReleaseDate((String) data.get("release_date"));
        result.setVoteAverage(
                data.get("vote_average") != null ? ((Number) data.get("vote_average")).doubleValue() : null);
        result.setOriginalLanguage((String) data.get("original_language"));
        return result;
    }

    private MovieDto.MovieResponse mapToMovieResponse(Map<String, Object> data) {
        MovieDto.MovieResponse response = new MovieDto.MovieResponse();
        response.setTmdbId(((Number) data.get("id")).longValue());
        response.setTitle((String) data.get("title"));
        response.setOverview((String) data.get("overview"));
        String releaseDate = (String) data.get("release_date");
        if (releaseDate != null && releaseDate.length() >= 4) {
            response.setYear(Integer.parseInt(releaseDate.substring(0, 4)));
        }
        String posterPath = (String) data.get("poster_path");
        String backdropPath = (String) data.get("backdrop_path");
        response.setPosterUrl(posterPath != null ? tmdbImageBaseUrl + "/w500" + posterPath : null);
        response.setBackdropUrl(backdropPath != null ? tmdbImageBaseUrl + "/original" + backdropPath : null);
        response.setRating(data.get("vote_average") != null ? ((Number) data.get("vote_average")).doubleValue() : null);
        return response;
    }
}
