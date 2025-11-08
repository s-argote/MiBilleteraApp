import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Transaction } from '../models/Transaction';

const COLLECTION_NAME = 'transactions';

export const TransactionService = {

    /** Obtiene todas las transacciones del usuario */
    async getTransactions(): Promise<Transaction[]> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Transaction[];
    },

    /** Agrega una nueva transacción */
    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...transaction,
            userId: user.uid
        });

        return docRef.id;
    },

    /** Actualiza una sola transacción */
    async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
        const ref = doc(db, COLLECTION_NAME, id);
        await updateDoc(ref, transaction);
    },

    /** Elimina una transacción */
    async deleteTransaction(id: string): Promise<void> {
        const ref = doc(db, COLLECTION_NAME, id);
        await deleteDoc(ref);
    },

    /**  Elimina TODAS las transacciones relacionadas a una categoría */
    async deleteTransactionsByCategory(categoryId: string): Promise<void> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, COLLECTION_NAME),
            where("categoryId", "==", categoryId),
            where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);
        const deletions = snap.docs.map(docRef => deleteDoc(docRef.ref));

        await Promise.all(deletions);
    },

    /**  Actualiza todas las transacciones cuando una categoría cambia de nombre o color */
    async updateTransactionsCategoryColor(
        categoryId: string,
        data: { name?: string; color?: string }
    ) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, COLLECTION_NAME),
            where("categoryId", "==", categoryId),
            where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const updates = snap.docs.map(docRef =>
            updateDoc(docRef.ref, {
                category: data.name ?? docRef.data().category,
                color: data.color ?? docRef.data().color,
            })
        );

        await Promise.all(updates);
    }
};
