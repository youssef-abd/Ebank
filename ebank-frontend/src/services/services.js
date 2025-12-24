import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post('/auth/change-password', {
            oldPassword,
            newPassword,
        });
        return response.data;
    },
};

export const clientService = {
    createClient: async (clientData) => {
        const response = await api.post('/client', clientData);
        return response.data;
    },

    getAllClients: async () => {
        const response = await api.get('/client');
        return response.data;
    },

    getClientById: async (id) => {
        const response = await api.get(`/client/${id}`);
        return response.data;
    },

    getClientByNumeroIdentite: async (numeroIdentite) => {
        const response = await api.get(`/client/numero/${numeroIdentite}`);
        return response.data;
    },
};

export const compteService = {
    createCompte: async (compteData) => {
        const response = await api.post('/compte', compteData);
        return response.data;
    },

    getAllComptes: async () => {
        const response = await api.get('/compte');
        return response.data;
    },

    getComptesByClient: async (clientId) => {
        const response = await api.get(`/compte/client/${clientId}`);
        return response.data;
    },

    getCompteByRib: async (rib) => {
        const response = await api.get(`/compte/rib/${rib}`);
        return response.data;
    },
};

export const dashboardService = {
    getDashboard: async (page = 0, size = 10) => {
        const response = await api.get('/dashboard', {
            params: { page, size },
        });
        return response.data;
    },

    getDashboardByRib: async (rib, page = 0, size = 10) => {
        const response = await api.get(`/dashboard/compte/${rib}`, {
            params: { page, size },
        });
        return response.data;
    },

    getTop10Operations: async (rib) => {
        const response = await api.get(`/dashboard/operations/top10/${rib}`);
        return response.data;
    },
};

export const virementService = {
    effectuerVirement: async (virementData) => {
        const response = await api.post('/virement', virementData);
        return response.data;
    },
};
