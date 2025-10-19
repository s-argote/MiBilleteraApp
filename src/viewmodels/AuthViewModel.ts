import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';


export const useAuthViewModel = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    const handleError = (e: any, defaultMessage: string) => {
        console.error(e);
        if (e.code === 'auth/email-already-in-use') {
            setError('Este correo ya está registrado.');
        } else {
            // Extrae el código de error de Firebase para un mensaje más limpio
            setError(e.code ? `Error: ${e.code.replace('auth/', '').replace(/-/g, ' ')}` : defaultMessage);
        }
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
            const user = await AuthService.register(email, password);
            // Guardar el nombre en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                createdAt: new Date()
            });
            clearForm();

        } catch (e) {
            handleError(e, 'Error desconocido al registrarse');
            throw e; // Para que el componente sepa si falló
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
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        setError,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};