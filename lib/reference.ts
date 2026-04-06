import api from './http';

export async function getTopics() {
    const { data } = await api.get('/api/reference/topics');
    return data;
}
export async function getPaperTypes() {
    const { data } = await api.get('/api/reference/paper-types');
    return data;
}