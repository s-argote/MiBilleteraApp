import { useEffect, useState } from "react";
import { TransactionService } from "../services/TransactionService";
import { Transaction } from "../models/Transaction";
export const useHistoryViewModel = () => {
   const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
   const [filtered, setFiltered] = useState<Transaction[]>([]);
   const [loading, setLoading] = useState(true);
   /** Filtros */
   const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
   const [selectedType, setSelectedType] =
       useState<"all" | "Ingreso" | "Gasto">("all");
   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
   /** Cargar historial */
   const loadHistory = async () => {
       try {
           setLoading(true);
           const data = await TransactionService.getTransactions();
           setAllTransactions(data);
           setFiltered(data); // inicial
       } catch (error) {
           console.error("Error cargando historial:", error);
       } finally {
           setLoading(false);
       }
   };
   /** Aplicar filtros */
   const applyFilters = () => {
       let result = [...allTransactions];
       if (selectedMonth !== null) {
           result = result.filter(t => new Date(t.date).getMonth() === selectedMonth);
       }
       if (selectedType !== "all") {
           result = result.filter(t => t.type === selectedType);
       }
       if (selectedCategory !== null) {
           result = result.filter(t => t.categoryId === selectedCategory);
       }
       setFiltered(result);
   };
   useEffect(() => {
       applyFilters();
   }, [selectedMonth, selectedType, selectedCategory, allTransactions]);
   useEffect(() => {
       loadHistory();
   }, []);
   return {
       loading,
       filtered,
       selectedMonth,
       selectedType,
       selectedCategory,
       setSelectedMonth,
       setSelectedType,
       setSelectedCategory,
   };
};