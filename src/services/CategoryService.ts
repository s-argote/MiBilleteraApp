import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'categories';

/**
 * Servicio para gestionar categorías en Firestore.
 */
export const CategoryService = {
    /**
     * Obtiene todas las categorías del usuario autenticado.
     * @returns {Promise<Array>} Lista de categorías.
     */
    async getCategories() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(collection(db, COLLECTION_NAME), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /**
     * Agrega una nueva categoría con el userId del usuario actual.
     * @param {Object} category - Objeto con nombre y color.
     */
    async addCategory(category: { name: string; color: string }) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        await addDoc(collection(db, COLLECTION_NAME), {
            ...category,
            userId: user.uid,
        });
    },

    /**
     * Actualiza una categoría existente.
     * @param {string} id - ID de la categoría.
     * @param {Object} category - Datos a actualizar (nombre y/o color).
     */
    async updateCategory(id: string, category: { name?: string; color?: string }) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const ref = doc(db, COLLECTION_NAME, id);
        await updateDoc(ref, {
            ...category,
            userId: user.uid, // Asegura que la categoría siga perteneciendo al usuario.
        });
    },

    /**
     * Elimina una categoría por su ID.
     * @param {string} id - ID de la categoría.
     */
    async deleteCategory(id: string) {
        const ref = doc(db, COLLECTION_NAME, id);
        await deleteDoc(ref);
    },
};