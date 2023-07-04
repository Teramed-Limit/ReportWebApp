import { useEffect } from 'react';

import { setupInterceptors } from './axios';
import { useAuthStore } from '../models/useStore';

function InjectAxiosInterceptors() {
    const { removeAuth } = useAuthStore();

    useEffect(() => {
        setupInterceptors(removeAuth);
    }, [removeAuth]);

    return null;
}

export default InjectAxiosInterceptors;
