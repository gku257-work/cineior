package com.cineior.movie.dto;

import com.cineior.movie.model.Movie;
import lombok.Data;
import java.util.List;

public class MovieDto {

    @Data
    public static class MovieResponse {
        private Long id;
        private Long tmdbId;
        private String title;
        private Integer year;
        private List<String> genres;
        private Integer runtime;
        private String language;
        private String overview;
        private String posterUrl;
        private String backdropUrl;
        private Double rating;
        private String director;
        private String cast;

        public static MovieResponse from(Movie movie) {
            MovieResponse dto = new MovieResponse();
            dto.setId(movie.getId());
            dto.setTmdbId(movie.getTmdbId());
            dto.setTitle(movie.getTitle());
            dto.setYear(movie.getYear());
            dto.setGenres(movie.getGenres());
            dto.setRuntime(movie.getRuntime());
            dto.setLanguage(movie.getLanguage());
            dto.setOverview(movie.getOverview());
            dto.setPosterUrl(movie.getPosterUrl());
            dto.setBackdropUrl(movie.getBackdropUrl());
            dto.setRating(movie.getRating());
            dto.setDirector(movie.getDirector());
            dto.setCast(movie.getActors());
            return dto;
        }
    }

    @Data
    public static class TmdbSearchResult {
        private Long id;
        private String title;
        private String originalTitle;
        private String overview;
        private String posterPath;
        private String backdropPath;
        private String releaseDate;
        private Double voteAverage;
        private List<Integer> genreIds;
        private String originalLanguage;
    }

    @Data
    public static class TmdbMovieDetails {
        private Long id;
        private String title;
        private String overview;
        private String posterPath;
        private String backdropPath;
        private String releaseDate;
        private Double voteAverage;
        private Integer runtime;
        private String originalLanguage;
        private List<Genre> genres;
        private Credits credits;

        @Data
        public static class Genre {
            private Integer id;
            private String name;
        }

        @Data
        public static class Credits {
            private List<CastMember> cast;
            private List<CrewMember> crew;
        }

        @Data
        public static class CastMember {
            private String name;
            private String character;
            private Integer order;
        }

        @Data
        public static class CrewMember {
            private String name;
            private String job;
        }
    }
}
