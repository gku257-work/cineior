package com.cineior.user.dto;

import com.cineior.user.model.UserMovie;
import lombok.Data;
import java.util.List;

public class UserMovieDto {

    @Data
    public static class AddMovieRequest {
        private Long tmdbId;
        private String status; // WATCHED, WATCHLIST, FAVORITE
        private Integer userRating;
        private String personalNote;
    }

    @Data
    public static class UpdateMovieRequest {
        private String status;
        private Integer userRating;
        private String personalNote;
    }

    @Data
    public static class UserMovieResponse {
        private Long id;
        private Long movieId;
        private Long tmdbId;
        private String status;
        private Integer userRating;
        private String personalNote;

        // Movie details (populated from movie service)
        private String title;
        private Integer year;
        private List<String> genres;
        private String posterUrl;
        private String backdropUrl;
        private Double rating;

        public static UserMovieResponse from(UserMovie userMovie) {
            UserMovieResponse dto = new UserMovieResponse();
            dto.setId(userMovie.getId());
            dto.setMovieId(userMovie.getMovieId());
            dto.setTmdbId(userMovie.getTmdbId());
            dto.setStatus(userMovie.getStatus().name());
            dto.setUserRating(userMovie.getUserRating());
            dto.setPersonalNote(userMovie.getPersonalNote());
            return dto;
        }
    }
}
