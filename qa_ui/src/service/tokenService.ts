// src/utils/tokenService.ts
import {AuthData} from "../model/authModel.ts";

const AUTH_DATA = 'authData';

export const TokenService = {
    // Save token and user data to session storage
    getAuthData (): AuthData | null {
        const userData = sessionStorage.getItem(AUTH_DATA);
        if(!userData) {
            return null;
        }
        return JSON.parse(userData);
    },

    setAuthData(authData : AuthData): void {
        sessionStorage.setItem(AUTH_DATA, JSON.stringify(authData));
    },

    // Get token from session storage
    getToken(): string | null {
        const userData = sessionStorage.getItem(AUTH_DATA);
        if(!userData) {
            return null;
        }
        return JSON.parse(userData).token;
    },

    // Clear all auth data
    clearAuthData(): void {
        sessionStorage.removeItem(AUTH_DATA);
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};