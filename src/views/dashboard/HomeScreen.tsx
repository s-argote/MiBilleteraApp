import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { useDashboardViewModel } from '../../viewmodels/DashboardViewModel';
import { useAuthContext } from '../../context/AuthContext';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useNavigation } from "@react-navigation/native";


const screenWidth = Dimensions.get('window').width;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { balance, totalIncome, totalExpenses, pieData, lineData, loading, error } = useDashboardViewModel();
  const { user, profile } = useAuthContext();

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
        <View style={styles.loadingIconContainer}>
          <Ionicons name="wallet" size={60} color="#3B82F6" />
        </View>
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Cargando tu resumen financiero...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    Alert.alert('Error', error);
  }

  const pieWidth = Math.min(screenWidth * 0.45, 260);
  const balanceIsPositive = balance >= 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(0) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={['#FFFFFF', '#F3F4F6']}
                style={styles.avatarCircle}
              >
                <Text style={styles.avatarText}>
                  {(profile?.name?.[0] || user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </Text>
              </LinearGradient>

              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>¡Bienvenido de nuevo!</Text>
                <Text style={styles.userName}>
                  {profile?.name || user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Usuario"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Cuenta')}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Enhanced Balance Card */}
        <View style={styles.balanceCardContainer}>
          <LinearGradient
            colors={balanceIsPositive ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="wallet" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.balanceLabel}>Balance Total</Text>
                <Text style={styles.balanceValue}>
                  ${balance.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="trending-down" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Ingresos</Text>
                <Text style={styles.statValue}>
                  ${totalIncome.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="trending-up" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Gastos</Text>
                <Text style={styles.statValue}>
                  ${totalExpenses.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="pulse" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Ahorro</Text>
                <Text style={styles.statValue}>{savingsRate}%</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Mis Transacciones', {
                screen: 'Agregar Transacción'
              })}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.actionIconContainer}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Nueva{'\n'}Transacción</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Categorías')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionIconContainer}
              >
                <Ionicons name="grid" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Ver{'\n'}Categorías</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate('Cuenta', {
                  screen: 'Alertas y Metas'
                })
              }
            >
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.actionIconContainer}
              >
                <Ionicons name="pie-chart" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Mis{'\n'}Presupuestos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Detalle Financiero')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionIconContainer}
              >
                <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionLabel}>Ver{'\n'}Análisis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Line Chart Section */}
        {lineData && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="analytics" size={20} color="#1E40AF" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Evolución Mensual</Text>
                  <Text style={styles.sectionSubtitle}>Últimos 12 meses</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate("Detalle Financiero")}
              >
                <Text style={styles.detailButtonText}>Detalles</Text>
                <Ionicons name="chevron-forward" size={16} color="#1E40AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
              <LineChart
                data={lineData}
                width={screenWidth - 64}
                height={220}
                bezier
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: () => '#000',
                  formatYLabel: (value: string) => {
                    const n = Number(value);
                    if (isNaN(n)) return value;
                    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
                    if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
                    return n.toString();
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#FFFFFF',

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
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                yAxisLabel="$"
                onDataPointClick={(data: any) => {
                  const clickedDataset = data.dataset;
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

        {/* Pie Chart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="pie-chart" size={20} color="#1E40AF" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
                <Text style={styles.sectionSubtitle}>Este mes</Text>
              </View>
            </View>
          </View>

          {pieData.length > 0 ? (
            <>
              <View style={[styles.chartCard, styles.pieContainer]}>
                <View style={styles.pieChartWrapper}>
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
                </View>

                <View style={styles.pieLegendPanel}>
                  {pieData.slice(0, 5).map((item, index) => (
                    <View key={index} style={styles.pieLegendItem}>
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

              {/* Detailed List */}
              <View style={styles.categoryListContainer}>
                <Text style={styles.categoryListTitle}>Detalle por categoría</Text>
                {pieData.map((item, index) => (
                  <View key={index} style={styles.categoryListItem}>
                    <View style={styles.categoryListLeft}>
                      <LinearGradient
                        colors={[item.color, item.color + 'CC']}
                        style={styles.categoryListIcon}
                      >
                        <Ionicons name="pricetag" size={16} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.categoryListName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.categoryListPercent}>{item.percentage}% del total</Text>
                      </View>
                    </View>
                    <Text style={styles.categoryListAmount}>
                      ${item.amount.toLocaleString('es-CO')}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="pie-chart-outline" size={64} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No hay gastos registrados</Text>
              <Text style={styles.emptyText}>
                Comienza a registrar tus gastos para ver la distribución por categorías
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Mis Transacciones', {
                  screen: 'Agregar Transacción'
                })}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.emptyButtonGradient}
                >
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Agregar Gasto</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsIconContainer}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipsTitle}>Consejo Financiero</Text>
            <Text style={styles.tipsText}>
              {balanceIsPositive
                ? "¡Excelente! Tu balance es positivo. Considera ahorrar el 20% de tus ingresos."
                : "Tu balance es negativo. Revisa tus gastos y ajusta tu presupuesto."
              }
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
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
  loadingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Header
  headerGradient: {
    paddingBottom: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Balance Card
  balanceCardContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
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
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  detailButtonText: {
    fontSize: 13,
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

  // Pie Chart
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pieChartWrapper: {
    flex: 1,
  },
  pieLegendPanel: {
    flex: 1,
    gap: 12,
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  piePercent: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  // Category List
  categoryListContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryListTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  categoryListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryListIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryListName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  categoryListPercent: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  categoryListAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },

  // Empty State
  emptyStateCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Tips Card
  tipsCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 14,
    color: '#92400E',
  },
});