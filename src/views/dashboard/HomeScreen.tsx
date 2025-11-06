import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { db, auth } from '../../services/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { PieChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type Transaction = {
  id: string;
  type: 'Ingreso' | 'Gasto' | string;
  amount: number;
  category?: string;
  date: any;
};

export const HomeScreen: React.FC = () => {
  const user = auth.currentUser;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ name: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number | null;
    label?: string;
    color?: string;
    type?: string;
  } | null>(null);

  // 🔹 Cargar transacciones desde Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error al cargar transacciones:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del resumen financiero.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 🔹 Cargar categorías del usuario desde Firestore
useEffect(() => {
  if (!user) return;

  const q = query(collection(db, 'categories'), where('userId', '==', user.uid));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        color: doc.data().color,
      }));
      setCategories(data);
    },
    (error) => {
      console.error('Error al cargar categorías:', error);
    }
  );

  return () => unsubscribe();
}, [user]);


  // 🔹 Calcular ingresos, gastos y balance
  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type?.toLowerCase().includes('ingres'))
      .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

    const expenses = transactions
      .filter((t) => t.type?.toLowerCase().includes('gast'))
      .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

    return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
  }, [transactions]);

  // 🔹 Datos del gráfico circular (usando los colores de las categorías)
const pieData = useMemo(() => {
  const grouped = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.type?.toLowerCase().includes('gast')) {
      const cat = t.category || 'Otros';
      grouped.set(cat, (grouped.get(cat) || 0) + Math.abs(Number(t.amount)));
    }
  });

  // 🔸 Asignar color desde las categorías guardadas
  return Array.from(grouped.entries()).map(([name, value]) => {
    const catColor =
      categories.find((c) => c.name === name)?.color || '#9e9e9e'; // gris si no hay color definido
    return {
      name,
      amount: value,
      color: catColor,
      legendFontColor: '#333',
      legendFontSize: 12,
    };
  });
}, [transactions, categories]);


  // 🔹 Gráfico de líneas (Ingresos vs Gastos — 12 meses)
  const lineData = useMemo(() => {
    if (transactions.length === 0) return null;

    const now = new Date();
    const year = now.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(year, i, 1)
        .toLocaleString('es-ES', { month: 'short' })
        .toUpperCase(),
      year,
      month: i,
    }));

    const incomeData = months.map((m) => {
      return transactions
        .filter((t) => {
          if (!t.date) return false;
          const td = t.date?.toDate ? t.date.toDate() : new Date(t.date);
          return (
            td.getFullYear() === m.year &&
            td.getMonth() === m.month &&
            t.type?.toLowerCase().includes('ingres')
          );
        })
        .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
    });

    const expenseData = months.map((m) => {
      return transactions
        .filter((t) => {
          if (!t.date) return false;
          const td = t.date?.toDate ? t.date.toDate() : new Date(t.date);
          return (
            td.getFullYear() === m.year &&
            td.getMonth() === m.month &&
            t.type?.toLowerCase().includes('gast')
          );
        })
        .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
    });

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          data: incomeData,
          color: () => '#1B8A49', // Verde para ingresos
          strokeWidth: 3,
        },
        {
          data: expenseData,
          color: () => '#D32F2F', // Rojo para gastos
          strokeWidth: 3,
        },
      ],
      legend: ['Ingresos', 'Gastos'],
    };
  }, [transactions]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando tu resumen financiero...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <AntDesign name="home" size={22} color="#007AFF" />
          <Text style={styles.headerText}>
            Bienvenido, {user?.displayName || user?.email?.split('@')[0]}
          </Text>
        </View>

        {/* Tarjeta resumen */}
        <View style={styles.summaryCard}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <Text style={[styles.balanceValue, { color: balance >= 0 ? '#1b8a49' : '#d32f2f' }]}>
            ${balance.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
          </Text>

          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Ingresos</Text>
              <Text style={[styles.infoValue, { color: '#1B8A49' }]}>
                +${totalIncome.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Gastos</Text>
              <Text style={[styles.infoValue, { color: '#D32F2F' }]}>
                -${totalExpenses.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfico de línea */}
        {lineData && (
          <>
            <Text style={styles.sectionTitle}>Ingresos y Gastos Anuales</Text>
            <View style={styles.chartWrapper}>
              <LineChart
                data={lineData}
                width={screenWidth * 0.95}
                height={280}
                bezier
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: { r: '5', strokeWidth: '2', stroke: '#fff' },
                }}
                onDataPointClick={(data) => {
          // ✅ Identificar si pertenece al dataset de ingresos o gastos
                  const isIngreso = data.dataset.color().includes('#1B8A49');
                  const datasetLabel = isIngreso ? 'Ingreso' : 'Gasto';
                  const color = isIngreso ? '#1B8A49' : '#D32F2F';

                  setTooltip({
                    x: data.x,
                    y: data.y,
                    value: data.value,
                    label: `${lineData.labels[data.index]} - ${datasetLabel}`,
                    color,
                    type: datasetLabel,
                  });
                  setTimeout(() => setTooltip(null), 2500);
                }}
              />
              {tooltip && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: tooltip.x - 60,
                      top: tooltip.y - 50,
                      backgroundColor: tooltip.color,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>
                    {tooltip.label}
                  </Text>
                  <Text style={styles.tooltipValue}>
                    ${tooltip.value?.toLocaleString('es-CO')}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Gráfico circular */}
        <Text style={styles.sectionTitle}>Distribución de Gastos</Text>
        {pieData.length > 0 ? (
          <View style={styles.chartWrapper}>
            <PieChart
              data={pieData}
              width={screenWidth * 0.9}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              chartConfig={chartConfig}
              hasLegend
              absolute
              center={[0, 0]}
            />
          </View>
        ) : (
          <Text style={styles.emptyText}>No hay datos de gastos para mostrar.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// 🔹 Configuración de gráficos
const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContainer: { alignItems: 'center', paddingVertical: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 15, color: '#555' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerText: { fontSize: 17, fontWeight: '600', marginLeft: 10 },
  summaryCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 25,
  },
  balanceLabel: { color: '#777', fontSize: 14 },
  balanceValue: { fontSize: 28, fontWeight: 'bold', marginVertical: 6, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  infoBox: { alignItems: 'center' },
  infoTitle: { fontSize: 13, color: '#777' },
  infoValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  chartWrapper: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  chart: { marginVertical: 10, borderRadius: 16, alignSelf: 'center' },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  tooltipText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tooltipValue: { color: '#fff', fontSize: 13, marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 15, marginTop: 15 },
});