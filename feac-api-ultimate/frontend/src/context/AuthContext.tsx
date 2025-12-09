import React, { createContext, useEffect, useState } from "react";

interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
}

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        loading: true
    });

    // Load from localStorage
    useEffect(() => {
        const t = localStorage.getItem("feac_jwt");
        const u = localStorage.getItem("feac_user");

        setState({
            user: u ? JSON.parse(u) : null,
            token: t,
            loading: false
        });
    }, []);

    function login(token: string, user: any) {
        localStorage.setItem("feac_jwt", token);
        localStorage.setItem("feac_user", JSON.stringify(user));
        setState({ user, token, loading: false });
    }

    function logout() {
        localStorage.removeItem("feac_jwt");
        localStorage.removeItem("feac_user");
        setState({ user: null, token: null, loading: false });
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
