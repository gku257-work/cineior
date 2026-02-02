package com.cineior.user.repository;

import com.cineior.user.model.UserMovie;
import com.cineior.user.model.UserMovie.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMovieRepository extends JpaRepository<UserMovie, Long> {
    List<UserMovie> findByUserEmail(String userEmail);

    List<UserMovie> findByUserEmailAndStatus(String userEmail, MovieStatus status);

    Optional<UserMovie> findByUserEmailAndMovieId(String userEmail, Long movieId);

    boolean existsByUserEmailAndMovieId(String userEmail, Long movieId);
}
