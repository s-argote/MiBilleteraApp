import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useDashboardViewModel } from "../../viewmodels/DashboardViewModel";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export const FinancialDetailScreen = ({ navigation }: any) => {
    const { monthlyStats } = useDashboardViewModel();

    if (!monthlyStats) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingIconContainer}>
                        <Ionicons name="stats-chart" size={60} color="#3B82F6" />
                    </View>
                    <Text style={styles.loadingText}>Cargando datos financieros...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const balanceIsPositive = monthlyStats.balance >= 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Ionicons name="analytics" size={28} color="#FFFFFF" />
                <Text style={styles.headerTitle}>Resumen Financiero</Text>
                <View style={styles.headerRight} />
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Balance Principal Card */}
                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={balanceIsPositive
                            ? ['#10B981', '#059669']
                            : ['#EF4444', '#DC2626']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceGradient}
                    >
                        <View style={styles.balanceHeader}>
                            <View style={styles.balanceIconContainer}>
                                <Ionicons
                                    name={balanceIsPositive ? "trending-up" : "trending-down"}
                                    size={28}
                                    color="#FFFFFF"
                                />
                            </View>
                            <Text style={styles.balanceLabel}>Balance del Mes</Text>
                        </View>
                        <Text style={styles.balanceAmount}>
                            ${monthlyStats.balance.toLocaleString("es-CO")}
                        </Text>
                        <View style={styles.balanceFooter}>
                            <Ionicons
                                name={balanceIsPositive ? "arrow-up-circle" : "arrow-down-circle"}
                                size={16}
                                color="rgba(255,255,255,0.8)"
                            />
                            <Text style={styles.balanceStatus}>
                                {balanceIsPositive ? 'Balance positivo' : 'Balance negativo'}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {/* Ingresos Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="arrow-down-circle" size={24} color="#16A34A" />
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Ingresos</Text>
                        <Text style={[styles.statValue, { color: '#16A34A' }]}>
                            ${monthlyStats.totalIncome.toLocaleString("es-CO")}
                        </Text>
                        <View style={styles.statBadge}>
                            <Ionicons name="trending-up" size={12} color="#16A34A" />
                            <Text style={styles.statBadgeText}>Total</Text>
                        </View>
                    </View>

                    {/* Gastos Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="arrow-up-circle" size={24} color="#EF4444" />
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Gastos</Text>
                        <Text style={[styles.statValue, { color: '#EF4444' }]}>
                            ${monthlyStats.totalExpenses.toLocaleString("es-CO")}
                        </Text>
                        <View style={styles.statBadge}>
                            <Ionicons name="trending-down" size={12} color="#EF4444" />
                            <Text style={styles.statBadgeText}>Total</Text>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <View style={styles.chartTitleContainer}>
                            <View style={styles.chartIconContainer}>
                                <Ionicons name="stats-chart" size={10} color="#1E40AF" />
                            </View>
                            <Text style={styles.chartTitle}>Gastos por Día</Text>
                        </View>
                        <View style={styles.chartBadge}>
                            <View style={styles.chartBadgeDot} />
                            <Text style={styles.chartBadgeText}>Últimos 30 días</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <LineChart
                            data={monthlyStats.lineChart}
                            width={screenWidth - 64}
                            height={240}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                            withInnerLines={true}
                            withOuterLines={true}
                            withVerticalLines={false}
                            withHorizontalLines={true}
                            withVerticalLabels={true}
                            withHorizontalLabels={true}
                            withDots={true}
                            withShadow={false}
                            fromZero={true}
                        />
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Resumen Mensual</Text>
                        <Text style={styles.infoText}>
                            El gráfico muestra la evolución de tus gastos durante el mes actual.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: "#3B82F6",
        fill: "#FFFFFF"
    },
    propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: "#E5E7EB",
        strokeWidth: 1
    },
    propsForLabels: {
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: 6,
        fill: '#000'
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    loadingIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "500",
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        width: 40,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Content
    content: {
        padding: 20,
        paddingBottom: 40,
    },

    // Balance Card
    balanceCard: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    balanceGradient: {
        padding: 24,
    },
    balanceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    balanceIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    balanceLabel: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "600",
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 12,
    },
    balanceFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    balanceStatus: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "500",
    },

    // Stats Grid
    statsGrid: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statHeader: {
        marginBottom: 12,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    statLabel: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
        marginBottom: 6,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    statBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statBadgeText: {
        fontSize: 11,
        color: "#9CA3AF",
        fontWeight: "500",
    },

    // Chart Section
    chartSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    chartTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    chartIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    chartBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    chartBadgeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#3B82F6",
    },
    chartBadgeText: {
        fontSize: 11,
        color: "#000",
        fontWeight: "600",
    },
    chartContainer: {
        alignItems: "center",
        marginHorizontal: -12,
    },
    chart: {
        borderRadius: 16,
    },

    // Info Card
    infoCard: {
        flexDirection: "row",
        backgroundColor: "#EEF2FF",
        padding: 16,
        borderRadius: 12,
        gap: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#3B82F6",
    },
    infoIconContainer: {
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E40AF",
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: "#4B5563",
        lineHeight: 18,
    },

    // Action Buttons
    actionButtons: {
        gap: 12,
    },
    primaryButton: {
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 10,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        gap: 8,
    },
    secondaryButtonText: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
});