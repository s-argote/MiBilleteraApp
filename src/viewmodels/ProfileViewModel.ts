import { useState } from "react";
import { updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential, getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";

export const useProfileViewModel = () => {
    const { user, refreshProfile } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const updateName = async (newName: string) => {
        if (!user) throw new Error("No autenticado.");

        setLoading(true);
        try {
            await updateProfile(user, { displayName: newName });
            await updateDoc(doc(db, "users", user.uid), { name: newName });

            await refreshProfile();
        } finally {
            setLoading(false);
        }
    };

    const updateUserPassword = async (newPassword: string, currentPassword: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("Usuario no autenticado");

        // reautenticación
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // cambiar contraseña
        await updatePassword(user, newPassword);
    };

    return {
        loading,
        updateName,
        updateUserPassword
    };
};
