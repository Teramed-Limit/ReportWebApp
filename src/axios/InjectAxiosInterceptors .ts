import { useEffect } from 'react';

import { setupInterceptors } from './axios';
import { useAuthStore } from '../models/useStore';

function InjectAxiosInterceptors() {
    const { removeAuth, refreshToken } = useAuthStore();

    useEffect(() => {
        setupInterceptors(refreshToken, removeAuth);
    }, [refreshToken, removeAuth]);

    return null;
}

export default InjectAxiosInterceptors;
