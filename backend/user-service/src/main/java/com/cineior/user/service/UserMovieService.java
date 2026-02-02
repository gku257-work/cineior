package com.cineior.user.service;

import com.cineior.user.dto.UserMovieDto;
import com.cineior.user.model.UserMovie;
import com.cineior.user.repository.UserMovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMovieService {

    private final UserMovieRepository userMovieRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${movie-service.url}")
    private String movieServiceUrl;

    public List<UserMovieDto.UserMovieResponse> getUserMovies(String userEmail, String status) {
        List<UserMovie> userMovies;
        if (status != null && !status.isEmpty()) {
            userMovies = userMovieRepository.findByUserEmailAndStatus(userEmail, UserMovie.MovieStatus.valueOf(status));
        } else {
            userMovies = userMovieRepository.findByUserEmail(userEmail);
        }

        return userMovies.stream()
                .map(this::enrichWithMovieDetails)
                .collect(Collectors.toList());
    }

    public UserMovieDto.UserMovieResponse addMovie(String userEmail, UserMovieDto.AddMovieRequest request) {
        // Save movie to movie-service and get the movie ID
        @SuppressWarnings("unchecked")
        Map<String, Object> movieResponse = restTemplate.postForObject(
                movieServiceUrl + "/movies/save/" + request.getTmdbId(),
                null,
                Map.class);

        Long movieId = movieResponse != null ? ((Number) movieResponse.get("id")).longValue() : null;

        if (movieId == null) {
            throw new RuntimeException("Failed to save movie");
        }

        // Check if already exists for user
        if (userMovieRepository.existsByUserEmailAndMovieId(userEmail, movieId)) {
            throw new RuntimeException("Movie already in your list");
        }

        UserMovie userMovie = UserMovie.builder()
                .userEmail(userEmail)
                .movieId(movieId)
                .tmdbId(request.getTmdbId())
                .status(UserMovie.MovieStatus.valueOf(request.getStatus()))
                .userRating(request.getUserRating())
                .personalNote(request.getPersonalNote())
                .build();

        userMovie = userMovieRepository.save(userMovie);
        return enrichWithMovieDetails(userMovie);
    }

    public UserMovieDto.UserMovieResponse updateMovie(String userEmail, Long id,
            UserMovieDto.UpdateMovieRequest request) {
        UserMovie userMovie = userMovieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found in your list"));

        if (!userMovie.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Not authorized");
        }

        if (request.getStatus() != null) {
            userMovie.setStatus(UserMovie.MovieStatus.valueOf(request.getStatus()));
        }
        if (request.getUserRating() != null) {
            userMovie.setUserRating(request.getUserRating());
        }
        if (request.getPersonalNote() != null) {
            userMovie.setPersonalNote(request.getPersonalNote());
        }

        userMovie = userMovieRepository.save(userMovie);
        return enrichWithMovieDetails(userMovie);
    }

    public void removeMovie(String userEmail, Long id) {
        UserMovie userMovie = userMovieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found in your list"));

        if (!userMovie.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Not authorized");
        }

        userMovieRepository.delete(userMovie);
    }

    private UserMovieDto.UserMovieResponse enrichWithMovieDetails(UserMovie userMovie) {
        UserMovieDto.UserMovieResponse response = UserMovieDto.UserMovieResponse.from(userMovie);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> movie = restTemplate.getForObject(
                    movieServiceUrl + "/movies/internal/" + userMovie.getMovieId(),
                    Map.class);

            if (movie != null) {
                response.setTitle((String) movie.get("title"));
                response.setYear(movie.get("year") != null ? ((Number) movie.get("year")).intValue() : null);
                response.setPosterUrl((String) movie.get("posterUrl"));
                response.setBackdropUrl((String) movie.get("backdropUrl"));
                response.setRating(movie.get("rating") != null ? ((Number) movie.get("rating")).doubleValue() : null);
                @SuppressWarnings("unchecked")
                List<String> genres = (List<String>) movie.get("genres");
                response.setGenres(genres);
            }
        } catch (Exception e) {
            // If movie service is unavailable, return partial data
        }

        return response;
    }
}
