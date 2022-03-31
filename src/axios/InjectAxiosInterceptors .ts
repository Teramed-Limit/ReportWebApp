import { useEffect } from 'react';

import { useAuthStore } from '../models/useStore';
import { setupInterceptors } from './axios';

function InjectAxiosInterceptors() {
    const { removeAuth } = useAuthStore();

    useEffect(() => {
        setupInterceptors(removeAuth);
    }, [removeAuth]);

    return null;
}

export default InjectAxiosInterceptors;
