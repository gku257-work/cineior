package com.cineior.user.controller;

import com.cineior.user.dto.UserMovieDto;
import com.cineior.user.service.UserMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/movies")
@RequiredArgsConstructor
public class UserMovieController {

    private final UserMovieService userMovieService;

    @GetMapping
    public ResponseEntity<List<UserMovieDto.UserMovieResponse>> getUserMovies(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(userMovieService.getUserMovies(userEmail, status));
    }

    @PostMapping
    public ResponseEntity<UserMovieDto.UserMovieResponse> addMovie(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody UserMovieDto.AddMovieRequest request) {
        return ResponseEntity.ok(userMovieService.addMovie(userEmail, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserMovieDto.UserMovieResponse> updateMovie(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long id,
            @RequestBody UserMovieDto.UpdateMovieRequest request) {
        return ResponseEntity.ok(userMovieService.updateMovie(userEmail, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMovie(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long id) {
        userMovieService.removeMovie(userEmail, id);
        return ResponseEntity.noContent().build();
    }
}
