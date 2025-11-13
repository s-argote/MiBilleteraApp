import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

export const useAuthViewModel = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearForm = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleError = (e: any, defaultMessage: string) => {
        console.error(e);
        switch (e.code) {
            case "auth/email-already-in-use":
                setError("Este correo ya está registrado.");
                break;
            case "auth/weak-password":
                setError("La contraseña debe tener al menos 6 caracteres.");
                break;
            case "auth/wrong-password":
            case "auth/invalid-credential":
                setError("Contraseña incorrecta.");
                break;
            case "auth/user-not-found":
                setError("Usuario no registrado.");
                break;
            case "auth/email-not-verified":
                setError("Debes verificar tu correo antes de iniciar sesión.");
                break;
            default:
                setError(e.message || defaultMessage);
                break;
        }
    };

    // LOGIN — solo si el correo está verificado
    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const loggedUser = await AuthService.login(email, password);

            if (!loggedUser.emailVerified) {
                throw { code: "auth/email-not-verified" };
            }

            clearForm();
            return loggedUser;
        } catch (e: any) {
            handleError(e, "Error desconocido al iniciar sesión");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    // REGISTRO — crea usuario + envía verificación + guarda perfil
    const handleRegister = async () => {
        setLoading(true);
        setError(null);

        try {
            const user = await AuthService.register(email, password);

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                createdAt: new Date(),
            });

            clearForm();
            setError("Te enviamos un correo para verificar tu cuenta.");
        } catch (e: any) {
            handleError(e, "Error desconocido al registrarse");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (e) {
            console.error("Error al cerrar sesión", e);
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
