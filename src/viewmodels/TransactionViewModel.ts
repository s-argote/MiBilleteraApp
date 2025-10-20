import { useState, useEffect } from 'react';
import { TransactionService } from '../services/TransactionService';
import { Transaction } from '../models/Transaction';

export const useTransactionViewModel = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Carga las transacciones del usuario desde Firestore.
     */
    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await TransactionService.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Error al cargar transacciones:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Agrega una nueva transacción.
     */
    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const id = await TransactionService.addTransaction(transaction);
            setTransactions(prev => [{ ...transaction, id }, ...prev]);
        } catch (error) {
            console.error("Error al agregar transacción:", error);
            throw error;
        }
    };

    /**
     * Actualiza una transacción existente.
     */
    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        try {
            await TransactionService.updateTransaction(id, transaction);
            setTransactions(prev =>
                prev.map(t => (t.id === id ? { ...t, ...transaction } : t))
            );
        } catch (error) {
            console.error("Error al actualizar transacción:", error);
            throw error;
        }
    };

    /**
     * Elimina una transacción.
     */
    const deleteTransaction = async (id: string) => {
        try {
            await TransactionService.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error al eliminar transacción:", error);
            throw error;
        }
    };

    // Cargar transacciones al iniciar
    useEffect(() => {
        loadTransactions();
    }, []);

    return {
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        loadTransactions,
    };
};