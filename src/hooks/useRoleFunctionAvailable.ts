import { useCallback } from 'react';

import { useAuthStore } from '../models/useStore';

export const useRoleFunctionAvailable = () => {
    const { functionList } = useAuthStore();

    const checkAvailable = useCallback(
        (compareId: string): boolean => {
            return !!functionList.find((roleFunction) => {
                return compareId && compareId === roleFunction.CorrespondElementId;
            });
        },
        [functionList],
    );

    return { checkAvailable };
};
