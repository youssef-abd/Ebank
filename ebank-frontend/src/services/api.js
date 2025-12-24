import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Token expiré ou invalide
            if (error.response.status === 401) {
                const message = error.response.data.message;
                if (message && message.includes('Session invalide')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }

            // Accès refusé
            if (error.response.status === 403) {
                alert("Vous n'avez pas le droit d'accéder à cette fonctionnalité. Veuillez contacter votre administrateur");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
