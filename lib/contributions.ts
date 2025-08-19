import api from './http';

export async function listMyContributions(page = 0, size = 20) {
    const { data } = await api.get('/api/contributions', { params: { page, size } });
    return data;
}
export async function createContribution(payload: any) {
    const { data } = await api.post('/api/contributions', payload);
    return data;
}