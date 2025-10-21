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
        } else if (e.code === 'auth/weak-password') {
            setError('La contraseña debe tener al menos 6 caracteres.');
        } else if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
            setError('Credenciales incorrectas o usuario no registrado.');
        } else {
            setError(e.message || defaultMessage);
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
            throw e; // Propaga el error para que el componente lo maneje con Alert
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
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                createdAt: new Date()
            });
            clearForm();
        } catch (e) {
            handleError(e, 'Error desconocido al registrarse');
            throw e; // Propaga el error para que el componente lo maneje con Alert
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