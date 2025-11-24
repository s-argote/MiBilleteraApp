import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useDashboardViewModel } from "../../viewmodels/DashboardViewModel";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export const FinancialDetailScreen = ({ navigation }: any) => {
    const { monthlyStats } = useDashboardViewModel();

    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        value: number | null;
        label: string;
    } | null>(null);

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
            {/* Header */}
            <LinearGradient
                colors={["#1E40AF", "#3B82F6"]}
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
                {/* Balance Principal */}
                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={
                            balanceIsPositive
                                ? ["#10B981", "#059669"]
                                : ["#EF4444", "#DC2626"]
                        }
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
                                name={
                                    balanceIsPositive
                                        ? "arrow-up-circle"
                                        : "arrow-down-circle"
                                }
                                size={16}
                                color="rgba(255,255,255,0.8)"
                            />
                            <Text style={styles.balanceStatus}>
                                {balanceIsPositive ? "Balance positivo" : "Balance negativo"}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View
                                style={[
                                    styles.statIconContainer,
                                    { backgroundColor: "#DCFCE7" },
                                ]}
                            >
                                <Ionicons
                                    name="arrow-down-circle"
                                    size={24}
                                    color="#16A34A"
                                />
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Ingresos</Text>
                        <Text style={[styles.statValue, { color: "#16A34A" }]}>
                            ${monthlyStats.totalIncome.toLocaleString("es-CO")}
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View
                                style={[
                                    styles.statIconContainer,
                                    { backgroundColor: "#FEE2E2" },
                                ]}
                            >
                                <Ionicons
                                    name="arrow-up-circle"
                                    size={24}
                                    color="#EF4444"
                                />
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Gastos</Text>
                        <Text style={[styles.statValue, { color: "#EF4444" }]}>
                            ${monthlyStats.totalExpenses.toLocaleString("es-CO")}
                        </Text>
                    </View>
                </View>

                {/* Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <View style={styles.chartTitleContainer}>
                            <View style={styles.chartIconContainer}>
                                <Ionicons name="stats-chart" size={16} color="#1E40AF" />
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
                            fromZero={true}
                            withDots={true}
                            yAxisLabel="$"
                            onDataPointClick={(point) => {
                                setTooltip({
                                    x: point.x,
                                    y: point.y,
                                    value: point.value,
                                    label: `${monthlyStats.lineChart.labels[point.index]}`,
                                });

                                setTimeout(() => setTooltip(null), 3000);
                            }}
                        />

                        {/* Tooltip */}
                        {tooltip && (
                            <View
                                style={[
                                    styles.tooltip,
                                    {
                                        left: Math.max(
                                            10,
                                            Math.min(tooltip.x - 50, screenWidth - 120)
                                        ),
                                        top: tooltip.y - 55,
                                    },
                                ]}
                            >
                                <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
                                <Text style={styles.tooltipValue}>
                                    ${tooltip.value?.toLocaleString("es-CO")}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons
                            name="information-circle"
                            size={20}
                            color="#3B82F6"
                        />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Resumen Mensual</Text>
                        <Text style={styles.infoText}>
                            El gráfico muestra la evolución de tus gastos durante el mes
                            actual.
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
    labelColor: () => "#000000", // 👈 ETIQUETAS DE EJES EN NEGRO
    propsForLabels: {
        fontSize: 7,
        fontWeight: "bold",
        fill: "#000000",
    },
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: "#3B82F6",
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    headerRight: {
        width: 40,
    },

    content: {
        padding: 20,
    },

    // Balance
    balanceCard: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
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
        backgroundColor: "rgba(255,255,255,0.25)",
        justifyContent: "center",
        alignItems: "center",
    },
    balanceLabel: {
        fontSize: 16,
        color: "#FFFFFF",
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
        color: "rgba(255,255,255,0.9)",
    },

    // Stats
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
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },

    // Chart Section
    chartSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
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
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    chartContainer: {
        alignItems: "center",
        marginHorizontal: -12,
    },
    chart: {
        borderRadius: 16,
    },
    chartBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    chartBadgeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    chartBadgeText: {
        fontSize: 12,
        color: "#6B7280",
    },

    // Tooltip
    tooltip: {
        position: "absolute",
        backgroundColor: "#1E40AF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 110,
        zIndex: 10,
        elevation: 5,
    },
    tooltipLabel: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },
    tooltipValue: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },

    // Info Card
    infoCard: {
        flexDirection: "row",
        backgroundColor: "#EEF2FF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
        borderLeftColor: "#3B82F6",
        borderLeftWidth: 4,
    },
    infoIconContainer: {},
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E40AF",
    },
    infoText: {
        fontSize: 13,
        color: "#4B5563",
        lineHeight: 18,
    },
});
