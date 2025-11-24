import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const COLLECTION = 'budgets';

export const BudgetService = {

    async setBudgetForMonth(
        month: string,
        data: { monthlyBudget?: number; categoryBudgets?: Record<string, number> }
    ) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const id = `${user.uid}_${month}`;
        const ref = doc(db, COLLECTION, id);
        const now = Timestamp.now();

        const payload = {
            userId: user.uid,
            month,
            monthlyBudget: Number(data.monthlyBudget ?? 0),
            categoryBudgets: data.categoryBudgets ?? {},
            updatedAt: now,
            createdAt: now
        };

        await setDoc(ref, payload);
        return payload;
    },

    async getBudgetForMonth(month: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const id = `${user.uid}_${month}`;
        const ref = doc(db, COLLECTION, id);
        const snap = await getDoc(ref);

        return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null;
    },

    async deleteBudgetForMonth(month: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const id = `${user.uid}_${month}`;
        await deleteDoc(doc(db, COLLECTION, id));
    },

    async listBudgetsForUser() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const q = query(collection(db, COLLECTION), where('userId', '==', user.uid));
        const snap = await getDocs(q);

        return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    }
};
