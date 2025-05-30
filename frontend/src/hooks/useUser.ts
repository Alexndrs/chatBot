import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';
import type { UserContextType } from '../contexts/userContext';

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
