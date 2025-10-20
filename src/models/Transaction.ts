export interface Transaction {
    id: string;
    title: string;
    amount: number; // Positivo para ingresos, negativo para gastos
    type: 'Ingreso' | 'Gasto';
    date: string; // Formato: "YYYY-MM-DD"
    category: string;
    image?: string; // URL opcional de la imagen
    userId: string; // Para asociar la transacción con el usuario
}