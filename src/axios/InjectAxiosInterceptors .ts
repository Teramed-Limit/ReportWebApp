import { useEffect } from 'react';

import { useAuthStore } from '../models/useStore';
import { setupInterceptors } from './axios';

function InjectAxiosInterceptors() {
    const { removeAuth, registerAuth } = useAuthStore();

    useEffect(() => {
        setupInterceptors(registerAuth, removeAuth);
    }, [registerAuth, removeAuth]);

    return null;
}

export default InjectAxiosInterceptors;
