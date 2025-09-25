import { useState } from 'react';
import { AuthService } from '../services/AuthService';

export const useAuthViewModel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleError = (e: any, defaultMessage: string) => {
        console.error(e);
        // Extrae el código de error de Firebase para un mensaje más limpio
        setError(e.code ? `Error: ${e.code.replace('auth/', '').replace(/-/g, ' ')}` : defaultMessage);
    };

    /**
     * Lógica para el botón de Iniciar Sesión.
     */
    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await AuthService.login(email, password);
            clearForm();
        } catch (e) {
            handleError(e, 'Error desconocido al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Lógica para el botón de Registrarse.
     */
    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            await AuthService.register(email, password);
            clearForm();
        } catch (e) {
            handleError(e, 'Error desconocido al registrarse');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Lógica para el botón de Cerrar Sesión.
     */
    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (e: any) {
            console.error('Error al cerrar sesión:', e);
            // Opcional: manejar si el cierre de sesión falla
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};