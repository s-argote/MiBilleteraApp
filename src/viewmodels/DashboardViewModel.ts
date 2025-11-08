import { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { Transaction } from "../models/Transaction";

export const useDashboardViewModel = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Datos del Dashboard general
    const [balance, setBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    // Información para detalle mensual y anual
    const [monthlyStats, setMonthlyStats] = useState<any>(null);
    const [yearlyStats, setYearlyStats] = useState<any>(null);

    // Pie chart data
    const [pieData, setPieData] = useState<any[]>([]);
    // Line chart para el HomeScreen
    const [lineData, setLineData] = useState<any>(null);

    // ---  Cargar transacciones en tiempo real ---
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const list = snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as Transaction[];

                setTransactions(list);
                setLoading(false);
            },
            (err) => {
                console.error("Error:", err);
                setError("No se pudieron cargar las transacciones.");
            }
        );

        return () => unsubscribe();
    }, []);

    // --- Recalcular métricas cada vez que cambien las transacciones ---
    useEffect(() => {
        calculateGeneralStats();
        calculateMonthlyStats();
        calculateYearlyStats();
        calculatePieChart();
        calculateLineChart();
    }, [transactions]);

    //  1. MÉTRICAS GENERALES
    const calculateGeneralStats = () => {
        const income = transactions
            .filter((t) => t.type === "Ingreso")
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter((t) => t.type === "Gasto")
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setBalance(income - expenses);
    };

    //  2. PIE CHART (solo gastos)
    const calculatePieChart = () => {
        const grouped = new Map<string, number>();

        const expenses = transactions.filter((t) => t.type === "Gasto");

        expenses.forEach((t) => {
            const cat = t.category || "Otros";
            grouped.set(cat, (grouped.get(cat) || 0) + Math.abs(t.amount));
        });

        const total = Array.from(grouped.values()).reduce((s, n) => s + n, 0);

        const data = Array.from(grouped.entries()).map(([name, amount]) => {
            const matching = transactions.filter(t => t.category === name);
            const color = matching.length > 0 ? matching[0].color : "#9e9e9e";

            return {
                name,
                amount,
                color,
                legendFontColor: "#111",
                legendFontSize: 14,
                percentage: total ? Number(((amount / total) * 100).toFixed(1)) : 0,
            };
        });

        setPieData(
            data.sort((a, b) => b.amount - a.amount)
        );
    };

    //  3. LINE CHART ANUAL
    const calculateLineChart = () => {
        const now = new Date();
        const year = now.getFullYear();

        const months = Array.from({ length: 12 }).map((_, i) => {
            const date = new Date(year, i, 1);
            return date.toLocaleString("es-ES", { month: "short" }).toUpperCase();
        });

        const incomeData = months.map((_, i) =>
            transactions
                .filter(
                    (t) =>
                        t.type === "Ingreso" &&
                        new Date(t.date).getMonth() === i &&
                        new Date(t.date).getFullYear() === year
                )
                .reduce((s, t) => s + t.amount, 0)
        );

        const expenseData = months.map((_, i) =>
            transactions
                .filter(
                    (t) =>
                        t.type === "Gasto" &&
                        new Date(t.date).getMonth() === i &&
                        new Date(t.date).getFullYear() === year
                )
                .reduce((s, t) => s + Math.abs(t.amount), 0)
        );

        setLineData({
            labels: months,
            datasets: [
                { data: incomeData, color: () => "#1B8A49", strokeWidth: 3 },
                { data: expenseData, color: () => "#D32F2F", strokeWidth: 3 },
            ],
            legend: ["Ingresos", "Gastos"],
        });
    };

    //  4. DETALLE DEL MES ACTUAL
    const calculateMonthlyStats = () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        const monthTx = transactions.filter((t) => {
            const d = new Date(t.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });

        const income = monthTx
            .filter((t) => t.type === "Ingreso")
            .reduce((s, t) => s + t.amount, 0);

        const expenses = monthTx
            .filter((t) => t.type === "Gasto")
            .reduce((s, t) => s + Math.abs(t.amount), 0);

        // Crear gráfico por día del mes
        const days = Array.from({ length: 31 }, (_, i) => i + 1);

        const dailyExpenses = days.map((day) =>
            monthTx
                .filter(
                    (t) =>
                        t.type === "Gasto" &&
                        new Date(t.date).getDate() === day
                )
                .reduce((s, t) => s + Math.abs(t.amount), 0)
        );

        setMonthlyStats({
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            lineChart: {
                labels: days.map((d) => String(d)),
                datasets: [{ data: dailyExpenses }],
            },
            monthTransactions: monthTx,
        });
    };

    //  5. DETALLE DEL AÑO COMPLETO
    const calculateYearlyStats = () => {
        const now = new Date();
        const year = now.getFullYear();

        const months = Array.from({ length: 12 }, (_, i) => i);
        const labels = months.map((m) =>
            new Date(year, m, 1).toLocaleString("es-ES", { month: "short" })
        );

        const monthlyExpenses = months.map((m) =>
            transactions
                .filter(
                    (t) =>
                        t.type === "Gasto" &&
                        new Date(t.date).getMonth() === m &&
                        new Date(t.date).getFullYear() === year
                )
                .reduce((s, t) => s + Math.abs(t.amount), 0)
        );

        const avg = monthlyExpenses.reduce((a, b) => a + b, 0) / 12;

        // hallar max y min
        const maxAmount = Math.max(...monthlyExpenses);
        const minAmount = Math.min(...monthlyExpenses);

        const mostExpensiveMonth = {
            name: labels[monthlyExpenses.indexOf(maxAmount)],
            amount: maxAmount,
        };

        const cheapestMonth = {
            name: labels[monthlyExpenses.indexOf(minAmount)],
            amount: minAmount,
        };

        setYearlyStats({
            averageMonthly: avg,
            mostExpensiveMonth,
            cheapestMonth,
            barChart: {
                labels,
                datasets: [{ data: monthlyExpenses }],
            },
        });
    };

    return {
        balance,
        totalIncome,
        totalExpenses,
        pieData,
        lineData,
        loading,
        error,
        monthlyStats,
        yearlyStats,
    };
};
