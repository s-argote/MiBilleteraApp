import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useDashboardViewModel } from '../../viewmodels/DashboardViewModel';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";

const screenWidth = Dimensions.get('window').width;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthViewModel();
  const { balance, totalIncome, totalExpenses, pieData, lineData, loading, error } =
    useDashboardViewModel();

  const [profile, setProfile] = useState<any>(null);

  //  cargar perfil desde Firestore
  useEffect(() => {
    const loadProfile = async () => {
      const current = auth.currentUser;
      if (!current) return;

      const ref = doc(db, "users", current.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      }
    };

    loadProfile();
  }, []);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number | null;
    label?: string;
    color?: string;
  } | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Cargando tu resumen financiero...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    Alert.alert('Error', error);
  }

  // ancho del pie (para dejar espacio a la leyenda a la derecha)
  const pieWidth = Math.min(screenWidth * 0.45, 260);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(profile?.name?.[0] ||
                  user?.displayName?.[0] ||
                  user?.email?.[0] ||
                  "U"
                ).toUpperCase()}
              </Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hola,</Text>
              <Text style={styles.userName}>
                {profile?.name ||
                  user?.displayName?.split(' ')[0] ||
                  user?.email?.split('@')[0] ||
                  "Usuario"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            <Text style={styles.balanceLabel}>Balance Total</Text>
          </View>
          <Text style={styles.balanceValue}>
            ${balance.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="arrow-down" size={20} color="#10B981" />
              </View>
              <Text style={styles.statLabel}>Ingresos</Text>
              <Text style={styles.statValue}>
                ${totalIncome.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statBox}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Ionicons name="arrow-up" size={20} color="#EF4444" />
              </View>
              <Text style={styles.statLabel}>Gastos</Text>
              <Text style={styles.statValue}>
                ${totalExpenses.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Gráfico de líneas */}
        {lineData && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="trending-up" size={20} color="#1E40AF" />
                </View>
                <Text style={styles.sectionTitle}>Evolución Anual</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Detalle Financiero", { section: "monthly" })}>
                <Text style={styles.seeAllText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
              <LineChart
                data={lineData}
                width={screenWidth * 0.85}
                height={220}
                bezier
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(30, 64, 175, ${opacity * 0.8})`,
                  labelColor: () => '#000000',
                  formatYLabel: (value: string) => {
                    const n = Number(value);
                    if (isNaN(n)) return value;

                    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
                    if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
                    return n.toString();
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#ffffff',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#E5E7EB',
                    strokeWidth: 1,
                  },
                  propsForLabels: {
                    fontFamily: 'System',
                    fontWeight: 'bold',
                    fontSize: 8,
                    fill: '#000'
                  },
                }}
                style={styles.chart}
                onDataPointClick={(data: any) => {
                  const clickedDataset = data.dataset;

                  // El color del ingreso lo pusiste como #1B8A49
                  const isIngreso = clickedDataset.color && clickedDataset.color(1) === '#1B8A49';

                  setTooltip({
                    x: data.x,
                    y: data.y,
                    value: data.value,
                    label: `${lineData.labels[data.index]} - ${isIngreso ? 'Ingreso' : 'Gasto'}`,
                    color: isIngreso ? '#1B8A49' : '#D32F2F',
                  });

                  setTimeout(() => setTooltip(null), 3000);
                }}
              />

              {tooltip && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: Math.max(10, Math.min(tooltip.x - 60, screenWidth - 130)),
                      top: tooltip.y - 60,
                      backgroundColor: tooltip.color,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>{tooltip.label}</Text>
                  <Text style={styles.tooltipValue}>
                    ${tooltip.value?.toLocaleString('es-CO')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Gráfico circular + panel derecho con categorías y porcentajes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="pie-chart" size={20} color="#1E40AF" />
              </View>
              <Text style={styles.sectionTitle}>Distribución de Gastos</Text>
            </View>
          </View>

          {pieData.length > 0 ? (
            <>
              <View style={[styles.chartCard, styles.pieRow]}>
                <PieChart
                  data={pieData}
                  width={pieWidth}
                  height={200}
                  accessor="amount"
                  backgroundColor="transparent"
                  chartConfig={chartConfig}
                  hasLegend={false}
                  absolute
                  center={[20, 0]}
                  paddingLeft="15"
                />

                {/* Panel derecho con color + nombre + porcentaje */}
                <View style={styles.pieSidePanel}>
                  {pieData.map((item, index) => (
                    <View key={index} style={styles.pieSideItem}>
                      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.legendName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.piePercent}>{item.percentage}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista completa de categorías con montos y porcentaje */}
              <View style={styles.legendContainer}>
                {pieData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={styles.legendLeft}>
                      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.legendAmount}>
                        ${item.amount.toLocaleString('es-CO')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="pie-chart-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No hay datos de gastos</Text>
              <Text style={styles.emptySubtext}>
                Empieza a registrar tus gastos para ver la distribución
              </Text>
            </View>
          )}
        </View>

        {/* Resumen rápido */}
        <View style={styles.quickStatsContainer}>
          <Text style={styles.quickStatsTitle}>Resumen del mes</Text>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="calendar-outline" size={24} color="#1E40AF" />
              </View>
              <Text style={styles.quickStatLabel}>Este mes</Text>
              <Text style={styles.quickStatValue}>
                {new Date().toLocaleDateString('es-ES', { month: 'long' })}
              </Text>
            </View>

            <View style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: '#FEF3F2' }]}>
                <Ionicons name="trending-down-outline" size={24} color="#EF4444" />
              </View>
              <Text style={styles.quickStatLabel}>Gasto promedio anual</Text>
              <Text style={styles.quickStatValue}>
                ${Math.round(totalExpenses / 12).toLocaleString('es-CO')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Balance Card
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },

  // Charts
  chartCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tooltipValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Pie row (chart + side panel)
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pieSidePanel: {
    flex: 1,
    gap: 8,
    paddingLeft: 8,
  },
  pieSideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  piePercent: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // Legend list (debajo)
  legendContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Quick Stats
  quickStatsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  quickStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});
