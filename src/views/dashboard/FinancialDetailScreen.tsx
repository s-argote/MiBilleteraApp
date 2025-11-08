import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboardViewModel } from "../../viewmodels/DashboardViewModel";
import { LineChart, BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export const FinancialDetailScreen = ({ route, navigation }: any) => {
    const { section } = route.params || { section: "monthly" };
    const { monthlyStats, yearlyStats } =
        useDashboardViewModel();

    const [selectedSection, setSelectedSection] = useState(section);

    if (!monthlyStats || !yearlyStats) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 18, color: "#555" }}>Cargando datos...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalle Financiero</Text>
                    <View style={{ width: 30 }} />
                </View>

                {/* SWITCH SECCIÓN */}
                <View style={styles.switchContainer}>
                    <TouchableOpacity
                        style={[
                            styles.switchButton,
                            selectedSection === "monthly" && styles.switchSelected,
                        ]}
                        onPress={() => setSelectedSection("monthly")}
                    >
                        <Text
                            style={[
                                styles.switchText,
                                selectedSection === "monthly" && styles.switchTextSelected,
                            ]}
                        >
                            Mes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.switchButton,
                            selectedSection === "yearly" && styles.switchSelected,
                        ]}
                        onPress={() => setSelectedSection("yearly")}
                    >
                        <Text
                            style={[
                                styles.switchText,
                                selectedSection === "yearly" && styles.switchTextSelected,
                            ]}
                        >
                            Año
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ======= SECCIÓN: RESUMEN MENSUAL ======= */}
                {selectedSection === "monthly" && (
                    <>
                        <Text style={styles.sectionTitle}>Resumen del Mes</Text>

                        <View style={styles.card}>
                            <Text style={styles.statLabel}>Ingresos</Text>
                            <Text style={styles.statValue}>
                                ${monthlyStats.totalIncome.toLocaleString("es-CO")}
                            </Text>

                            <Text style={[styles.statLabel, { marginTop: 20 }]}>Gastos</Text>
                            <Text style={[styles.statValue, { color: "#EF4444" }]}>
                                ${monthlyStats.totalExpenses.toLocaleString("es-CO")}
                            </Text>

                            <Text style={[styles.statLabel, { marginTop: 20 }]}>Balance</Text>
                            <Text
                                style={[
                                    styles.statValue,
                                    { color: monthlyStats.balance >= 0 ? "#16A34A" : "#EF4444" },
                                ]}
                            >
                                ${monthlyStats.balance.toLocaleString("es-CO")}
                            </Text>
                        </View>

                        <Text style={styles.chartTitle}>Gastos por Día</Text>
                        <LineChart
                            data={monthlyStats.lineChart}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate("TransactionsScreen", {
                                    filter: "currentMonth",
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Ver transacciones del mes</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* ======= SECCIÓN: RESUMEN ANUAL ======= */}
                {selectedSection === "yearly" && (
                    <>
                        <Text style={styles.sectionTitle}>Gasto Promedio Anual</Text>

                        <View style={styles.card}>
                            <Text style={styles.statLabel}>Promedio mensual</Text>
                            <Text style={styles.statValue}>
                                ${yearlyStats.averageMonthly.toLocaleString("es-CO")}
                            </Text>

                            <Text style={[styles.statLabel, { marginTop: 20 }]}>
                                Mes más costoso
                            </Text>
                            <Text style={[styles.statValue, { color: "#EF4444" }]}>
                                {yearlyStats.mostExpensiveMonth.name}: $
                                {yearlyStats.mostExpensiveMonth.amount.toLocaleString("es-CO")}
                            </Text>

                            <Text style={[styles.statLabel, { marginTop: 20 }]}>
                                Mes más económico
                            </Text>
                            <Text style={[styles.statValue, { color: "#16A34A" }]}>
                                {yearlyStats.cheapestMonth.name}: $
                                {yearlyStats.cheapestMonth.amount.toLocaleString("es-CO")}
                            </Text>
                        </View>

                        <Text style={styles.chartTitle}>Gastos por Mes</Text>
                        <BarChart
                            data={yearlyStats.barChart}
                            width={screenWidth - 40}
                            height={260}
                            yAxisLabel="$"
                            yAxisSuffix=""
                            chartConfig={chartConfig}
                            style={styles.chart}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate("TransactionsScreen", {
                                    filter: "year",
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Ver transacciones del año</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => `black`,
    labelColor: () => `black`,
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    content: { paddingBottom: 40, paddingHorizontal: 20 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
    switchContainer: { flexDirection: "row", backgroundColor: "#e5e7eb", borderRadius: 10, marginBottom: 20 },
    switchButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
    switchSelected: { backgroundColor: "#3b82f6" },
    switchText: { fontSize: 16, fontWeight: "600", color: "#555" },
    switchTextSelected: { color: "#fff" },
    sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#333" },
    card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 26 },
    statLabel: { fontSize: 16, color: "#666" },
    statValue: { fontSize: 22, fontWeight: "700", color: "#3b82f6" },
    chartTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, color: "#333" },
    chart: { borderRadius: 10, marginBottom: 20 },
    button: { backgroundColor: "#3b82f6", paddingVertical: 15, borderRadius: 12, marginTop: 10 },
    buttonText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },
});
