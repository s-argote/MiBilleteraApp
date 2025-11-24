import { useState, useEffect } from 'react';
import { TransactionService } from '../services/TransactionService';
import { Transaction } from '../models/Transaction';
import { ImageService } from "../services/ImageService";
import { BudgetService } from '../services/BudgetService';
import { TransactionTotalsService } from '../services/TransactionTotalsService';
import { Alert } from 'react-native';


export const useTransactionViewModel = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const uploadImage = async (uri: string) => ImageService.uploadImage(uri);
    const deleteImageFromStorage = async (url: string) => ImageService.deleteImage(url);

    const getMonthIdFromDateString = (dateStr: string) => {
        const [y, m] = dateStr.split("-");
        return `${y}-${m}`;
    };

    //  Lógica corregida del presupuesto
    const checkBudgetsForMonth = async (monthId: string) => {
        try {
            const budget = await BudgetService.getBudgetForMonth(monthId);
            if (!budget) return;

            const totals = await TransactionTotalsService.getTotalsForMonth(monthId);
            const alerts: { title: string; message: string }[] = [];

            //  VALIDAR PRESUPUESTO MENSUAL
            if (budget.monthlyBudget && Number(budget.monthlyBudget) > 0) {
                const percent = (totals.total / Number(budget.monthlyBudget)) * 100;

                if (percent >= 100) {
                    alerts.push({
                        title: "Presupuesto mensual superado",
                        message: "Has alcanzado o superado tu presupuesto mensual."
                    });
                } else if (percent >= 90) {
                    alerts.push({
                        title: "Aviso mensual",
                        message: "Estás cerca de superar tu presupuesto mensual (90%)."
                    });
                }
            }

            //  VALIDAR PRESUPUESTO POR CATEGORÍA
            const catBudgets = budget.categoryBudgets || {};
            const spentByCat = totals.byCategoryId;

            for (const catId in catBudgets) {
                const limit = Number(catBudgets[catId]);
                if (!limit || isNaN(limit)) continue;

                const spent = spentByCat[catId] || 0;
                const percent = (spent / limit) * 100;

                if (percent >= 100) {
                    alerts.push({
                        title: "Presupuesto por categoría superado",
                        message: `Has superado el presupuesto de una categoría.`
                    });
                } else if (percent >= 90) {
                    alerts.push({
                        title: "Aviso de categoría",
                        message: `Estás cerca de alcanzar el presupuesto de una categoría (90%).`
                    });
                }
            }

            //  Mostrar todas las alertas secuencialmente
            for (const alert of alerts) {
                await new Promise<void>(resolve => {
                    Alert.alert(alert.title, alert.message, [
                        { text: 'OK', onPress: () => resolve() }
                    ]);
                });
            }

        } catch (err) {
            console.error("Error comprobando presupuestos:", err);
        }
    };
    // ...existing code...

    // ============================== CRUD ==============================

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

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const id = await TransactionService.addTransaction(transaction);
            setTransactions(prev => [{ ...transaction, id }, ...prev]);

            await checkBudgetsForMonth(getMonthIdFromDateString(transaction.date));
        } catch (error) {
            console.error("Error al agregar transacción:", error);
            throw error;
        }
    };

    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        try {
            const old = transactions.find(t => t.id === id);

            await TransactionService.updateTransaction(id, transaction);

            setTransactions(prev =>
                prev.map(t => (t.id === id ? { ...t, ...transaction } : t))
            );

            if (transaction.date) {
                await checkBudgetsForMonth(getMonthIdFromDateString(transaction.date));
                if (old?.date && old.date !== transaction.date) {
                    await checkBudgetsForMonth(getMonthIdFromDateString(old.date));
                }
            }

        } catch (error) {
            console.error("Error al actualizar transacción:", error);
            throw error;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            const old = transactions.find(t => t.id === id);

            await TransactionService.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));

            if (old?.date) {
                await checkBudgetsForMonth(getMonthIdFromDateString(old.date));
            }

        } catch (error) {
            console.error("Error al eliminar transacción:", error);
            throw error;
        }
    };

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
        uploadImage,
        deleteImageFromStorage
    };
};
