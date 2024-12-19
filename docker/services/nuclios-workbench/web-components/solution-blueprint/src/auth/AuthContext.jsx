import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
// import AdalAuth from './auth/AdalAuth';
import BaseAuth from './auth/BaseAuth';
import MsalAuth from './auth/MSALAuth';

export const AuthContext = createContext(BaseAuth);

export class PublicAuthConnector {
    static authContext = new BaseAuth();
}

export default function AuthContextProvider({ method = 'msal', children }) {
    const [initited, setInitiated] = useState(false);
    const [value, setValue] = useState(() => {
        let val = new BaseAuth();
        if (method === 'msal') {
            val = new MsalAuth();
        }
        PublicAuthConnector.authContext = val;
        return val;
    });

    value.setUser = (user) => {
        setValue((v) => {
            v.user = user;
            return { ...v };
        });
    };

    useEffect(() => {
        (async () => {
            try {
                await value.init();
            } catch (err) {
                // TODO
            } finally {
                setInitiated(true);
            }
        })();
    }, []);

    if (!initited) {
        return null;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
