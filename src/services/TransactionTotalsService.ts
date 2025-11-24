import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const TransactionTotalsService = {
    async getTotalsForMonth(month: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Usuario no autenticado');

        const [y, m] = month.split('-').map(Number);

        const first = `${y}-${String(m).padStart(2, '0')}-01`;
        const lastDate = new Date(y, m, 0).getDate();
        const last = `${y}-${String(m).padStart(2, '0')}-${String(lastDate).padStart(2, '0')}`;

        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            where('date', '>=', first),
            where('date', '<=', last)
        );

        const snap = await getDocs(q);
        const items = snap.docs.map(d => d.data() as any);

        let total = 0;

        const byCategoryId: Record<string, number> = {};

        items.forEach((t: any) => {
            if (t.type !== 'Gasto') return;

            const amount = Math.abs(t.amount || 0);
            total += amount;

            if (t.categoryId) {
                byCategoryId[t.categoryId] = (byCategoryId[t.categoryId] || 0) + amount;
            }
        });

        return { total, byCategoryId };
    }
};
