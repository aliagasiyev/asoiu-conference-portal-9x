import api from './http';

export async function listMyPapers(page = 0, size = 20) {
    const { data } = await api.get('/api/papers', { params: { page, size } });
    return data;
}
export async function createPaper(payload: any) {
    const { data } = await api.post('/api/papers', payload);
    return data;
}
export async function uploadPdf(paperId: number, file: File) {
    const fd = new FormData(); fd.append('file', file);
    const { data } = await api.post(`/api/papers/${paperId}/file`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}
export async function uploadCameraReady(paperId: number, file: File) {
    const fd = new FormData(); fd.append('file', file);
    const { data } = await api.post(`/api/papers/${paperId}/camera-ready`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}
export async function submitPaper(paperId: number) {
    const { data } = await api.post(`/api/papers/${paperId}/submit`);
    return data;
}
export async function submitCameraReady(paperId: number) {
    const { data } = await api.post(`/api/papers/${paperId}/submit-camera-ready`);
    return data;
}
export async function withdrawPaper(paperId: number) {
    const { data } = await api.post(`/api/papers/${paperId}/withdraw`);
    return data;
}
export async function addCoAuthor(paperId: number, payload: any) {
    const { data } = await api.post(`/api/papers/${paperId}/co-authors`, payload);
    return data;
}
export async function updateCoAuthor(paperId: number, coAuthorId: number, payload: any) {
    const { data } = await api.put(`/api/papers/${paperId}/co-authors/${coAuthorId}`, payload);
    return data;
}
export async function deleteCoAuthor(paperId: number, coAuthorId: number) {
    await api.delete(`/api/papers/${paperId}/co-authors/${coAuthorId}`);
}

export async function deletePaper(paperId: number) {
    await api.delete(`/api/papers/${paperId}`);
}