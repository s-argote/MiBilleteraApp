import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Transaction } from '../models/Transaction';

const COLLECTION_NAME = 'transactions';

export const TransactionService = {
    /**
     * Obtiene todas las transacciones del usuario autenticado.
     */
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
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
    },

    /**
     * Agrega una nueva transacción.
     */
    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...transaction,
            userId: user.uid,
        });
        return docRef.id;
    },

    /**
     * Actualiza una transacción existente.
     */
    async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<void> {
        const ref = doc(db, COLLECTION_NAME, id);
        await updateDoc(ref, transaction);
    },

    /**
     * Elimina una transacción.
     */
    async deleteTransaction(id: string): Promise<void> {
        const ref = doc(db, COLLECTION_NAME, id);
        await deleteDoc(ref);
    },
};