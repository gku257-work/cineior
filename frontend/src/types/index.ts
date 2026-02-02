export interface Movie {
  id?: number;
  tmdbId: number;
  title: string;
  year?: number;
  genres?: string[];
  runtime?: number;
  language?: string;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  rating?: number;
  director?: string;
  cast?: string;
}

export interface UserMovie extends Movie {
  userMovieId?: number;
  userStatus?: 'WATCHED' | 'WATCHLIST' | 'FAVORITE';
  userRating?: number;
  personalNote?: string;
}

export interface TmdbSearchResult {
  id: number;
  title: string;
  originalTitle?: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  originalLanguage?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}
