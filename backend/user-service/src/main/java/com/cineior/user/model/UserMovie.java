package com.cineior.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_movies", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_email", "movie_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieStatus status;

    private Integer userRating;

    @Column(columnDefinition = "TEXT")
    private String personalNote;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    public enum MovieStatus {
        WATCHED, WATCHLIST, FAVORITE
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
