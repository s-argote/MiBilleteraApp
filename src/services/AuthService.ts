import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, User } from 'firebase/auth';
import { auth } from './firebase';
 
 
export const AuthService = {
    /**
     * Inicia sesión con email y contraseña.
     */
    async login(email: string, password: string): Promise<User> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },
 
    /**
     * Registra un nuevo usuario con email y contraseña.
     */
    async register(email: string, password: string): Promise<User> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //  Enviar email de verificación
        await sendEmailVerification(userCredential.user);
 
        return userCredential.user;
    },
 
    /**
     * Envía un correo para restablecer la contraseña.
     */
    async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    },
 
    /**
     * Cierra la sesión del usuario actual.
     */
    async logout(): Promise<void> {
        await signOut(auth);
    },
 
    /**
     * Suscribe un observador a los cambios de estado de autenticación.
     */
    onAuthStateChanged: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    },
};
 