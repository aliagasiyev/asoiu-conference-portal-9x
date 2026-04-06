import api from './http';

export async function downloadFile(fileId: number) {
    const res = await api.get(`/api/files/${fileId}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url; a.download = 'file.pdf'; a.click();
    window.URL.revokeObjectURL(url);
}