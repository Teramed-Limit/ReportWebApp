import { useEffect } from 'react';

import { useAuthStore } from '../models/useStore';
import { setupInterceptors } from './axios';

function InjectAxiosInterceptors() {
    const { removeAuth, refreshToken } = useAuthStore();

    useEffect(() => {
        setupInterceptors(refreshToken, removeAuth);
    }, [refreshToken, removeAuth]);

    return null;
}

export default InjectAxiosInterceptors;
