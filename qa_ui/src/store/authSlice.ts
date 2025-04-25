import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: string
    name: string
    email: string
    picture?: string
}

interface AuthState {
    token: string | null
    user: User | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token
            state.user = action.payload.user
            state.isAuthenticated = true

            // Store in session storage
            sessionStorage.setItem('auth', JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.isAuthenticated = false
            sessionStorage.removeItem('auth')
        },
        loadFromStorage: (state) => {
            const storedAuth = sessionStorage.getItem('auth')
            if (storedAuth) {
                const { token, user } = JSON.parse(storedAuth)
                state.token = token
                state.user = user
                state.isAuthenticated = true
            }
        }
    }
})

export const { setCredentials, logout, loadFromStorage } = authSlice.actions
export default authSlice.reducer