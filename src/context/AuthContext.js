import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
// Create an authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Login function
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            // Assuming response.data contains the token and user information
            const { token, user: userData } = response.data;
            // Set the user state with the received data and token
            setUser({ ...userData, token });
            localStorage.setItem('token', token);
            console.log(token)
            console.log(user._id)
            
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            throw error; // Optionally, rethrow the error to handle it elsewhere
        }
    };

    // Registration function
    const register = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
            // Optionally, handle response after registration (e.g., auto-login)
            return response.data; // Return any useful data
        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error.message);
            throw error; // Rethrow for handling elsewhere
        }
    };

    // Logout function
    const logout = () => {
        setUser(null); // Clear the user state on logout
    };

    // Provide the user state and functions to the context
    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
            
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
