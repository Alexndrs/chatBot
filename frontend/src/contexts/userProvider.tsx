import React, { useState } from 'react';
import { UserContext } from './userContext';
import type { UserData, Apis, Models } from './userContext';

interface Props {
    children: React.ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [availableApis, setAvailableApis] = useState<Apis | null>(null);
    const [availableModels, setAvailableModels] = useState<Models | null>(null);



    return (
        <UserContext.Provider value={{ userData, setUserData, loading, setLoading, availableApis, setAvailableApis, availableModels, setAvailableModels }}>
            {children}
        </UserContext.Provider>
    );
};
