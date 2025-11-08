import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'categories';

// Normaliza nombres: quita espacios extra y pone lowercase
const normalize = (text: string) =>
    text.trim().replace(/\s+/g, ' ');

export const CategoryService = {

    /**  Obtiene todas las categorías del usuario */
    async getCategories() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', user.uid)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));
    },

    /**  Agrega categoría con nombre limpio */
    async addCategory(category: { name: string; color: string }) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const cleanCategory = {
            name: normalize(category.name),
            color: category.color.trim(),
            userId: user.uid,
        };

        return await addDoc(collection(db, COLLECTION_NAME), cleanCategory);
    },

    /**  Actualiza categoría (solo los valores que lleguen) */
    async updateCategory(id: string, category: { name?: string; color?: string }) {

        const cleanData: any = {};

        if (category.name !== undefined) {
            cleanData.name = normalize(category.name);
        }
        if (category.color !== undefined) {
            cleanData.color = category.color.trim();
        }

        const ref = doc(db, COLLECTION_NAME, id);
        await updateDoc(ref, cleanData);
    },

    /**  Elimina categoría */
    async deleteCategory(id: string) {
        const ref = doc(db, COLLECTION_NAME, id);
        await deleteDoc(ref);
    },
};
