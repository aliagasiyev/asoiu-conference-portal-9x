import api from './http';

export async function login(email: string, password: string) {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('asiou_jwt', data.accessToken);
    return data;
}

export async function me() {
    const { data } = await api.get('/api/me');
    return data; // email string
}

export async function register(payload: {email:string;password:string;firstName:string;lastName:string}) {
    const { data } = await api.post('/api/auth/register', payload);
    localStorage.setItem('asiou_jwt', data.accessToken);
    return data;
}

export async function forgotPassword(email: string) {
    await api.post('/api/auth/forgot-password', { email });
}

export async function resetPassword(token: string, newPassword: string) {
    await api.post('/api/auth/reset-password', { token, newPassword });
}