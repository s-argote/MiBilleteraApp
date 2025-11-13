import { useEffect, useState, useCallback } from "react";
import { TransactionService } from "../services/TransactionService";
import { Transaction } from "../models/Transaction";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const useHistoryViewModel = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"all" | "Ingreso" | "Gasto">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /** Cargar historial */
  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactions();
      setAllTransactions(data);
      setFiltered(data);
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

  /** Recargar al volver a la pantalla */
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /** EXPORTAR PDF */
  const exportPDF = async () => {
    if (filtered.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Calcular totales
    const totalIngresos = filtered
      .filter((t) => t.type === "Ingreso")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalGastos = filtered
      .filter((t) => t.type === "Gasto")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIngresos - totalGastos;

    const formatLocalDate = (dateString: string) => {
      // Si viene como timestamp de Firestore
      if ((dateString as any)?.toDate) {
        const d = (dateString as any).toDate();
        return new Intl.DateTimeFormat("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(d);
      }
      // Si viene como "YYYY-MM-DD"
      const [year, month, day] = dateString.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);

      return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(localDate);
    };

    const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 30px;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #007AFF;
            margin-bottom: 10px;
          }
          h2 {
            text-align: center;
            font-size: 16px;
            font-weight: normal;
            color: #666;
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
          }
          th {
            background-color: #007AFF;
            color: white;
            padding: 10px;
            text-align: left;
          }
          td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .amount-ingreso {
            color: #10B981;
            font-weight: bold;
          }
          .amount-gasto {
            color: #EF4444;
            font-weight: bold;
          }
          .summary {
            margin-top: 25px;
            padding: 15px;
            background-color: #F4F4F5;
            border-radius: 10px;
          }
          .summary h3 {
            margin: 5px 0;
          }
          .summary .ingresos {
            color: #10B981;
          }
          .summary .gastos {
            color: #EF4444;
          }
          .summary .balance {
            color: ${balance >= 0 ? "#10B981" : "#EF4444"};
            font-weight: bold;
          }
        </style>
      </head>
      <body>
      <h1>Mi Billetera</h1>
        <h1>Historial de Movimientos</h1>
        <h2>${new Date().toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</h2>

        <table>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
          ${filtered
        .map(
          (t) => `
            <tr>
              <td>${formatLocalDate(t.date)}</td>
              <td>${t.type}</td>
              <td>${t.category}</td>
              <td>${t.title || "-"}</td>
              <td class="${t.type === "Ingreso" ? "amount-ingreso" : "amount-gasto"
            }">
                ${t.type === "Ingreso" ? "+" : "-"}$${Math.abs(
              t.amount
            ).toLocaleString("es-CO")}
              </td>
            </tr>`
        )
        .join("")}
        </table>

        <div class="summary">
          <h3 class="ingresos">Total Ingresos: $${totalIngresos.toLocaleString(
          "es-CO"
        )}</h3>
          <h3 class="gastos">Total Gastos: $${totalGastos.toLocaleString(
          "es-CO"
        )}</h3>
          <h3 class="balance">Balance final: $${balance.toLocaleString(
          "es-CO"
        )}</h3>
        </div>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };


  return {
    loading,
    filtered,
    selectedMonth,
    selectedType,
    selectedCategory,
    setSelectedMonth,
    setSelectedType,
    setSelectedCategory,
    exportPDF,
  };
};
