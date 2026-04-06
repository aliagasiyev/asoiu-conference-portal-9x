import { useEffect } from 'react';

export default function useAuthGuard() {
    useEffect(() => {
        const t = localStorage.getItem('asiou_jwt');
        if (!t) {
            // In this SPA-like flow, we don't route. Components relying on this
            // hook should already conditionally render based on localStorage.
            // No-op to avoid redirecting to a non-existent route.
        }
    }, []);
}