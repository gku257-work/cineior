import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth APIs
export const authApi = {
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};

// Movie APIs
export const movieApi = {
    search: async (query: string) => {
        const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
    discover: async (page = 1) => {
        const response = await api.get(`/movies/discover?page=${page}`);
        return response.data;
    },
    topRated: async (page = 1) => {
        const response = await api.get(`/movies/top-rated?page=${page}`);
        return response.data;
    },
    trending: async () => {
        const response = await api.get('/movies/trending');
        return response.data;
    },
    byGenre: async (slug: string, page = 1) => {
        const response = await api.get(`/movies/genre/${slug}?page=${page}`);
        return response.data;
    },
    details: async (tmdbId: number) => {
        const response = await api.get(`/movies/${tmdbId}/details`);
        return response.data;
    },
};

// User Movie APIs
export const userMovieApi = {
    getAll: async (status?: string) => {
        const url = status ? `/user/movies?status=${status}` : '/user/movies';
        const response = await api.get(url);
        return response.data;
    },
    add: async (tmdbId: number, status: string, userRating?: number, personalNote?: string) => {
        const response = await api.post('/user/movies', {
            tmdbId,
            status,
            userRating,
            personalNote
        });
        return response.data;
    },
    update: async (id: number, data: { status?: string; userRating?: number; personalNote?: string }) => {
        const response = await api.put(`/user/movies/${id}`, data);
        return response.data;
    },
    remove: async (id: number) => {
        await api.delete(`/user/movies/${id}`);
    },
};

// Helper to get full image URL
export const getImageUrl = (path: string | null | undefined, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
