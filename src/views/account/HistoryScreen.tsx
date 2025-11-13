import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useHistoryViewModel } from "../../viewmodels/HistoryViewModel";
import { db, auth } from "../../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


export const HistoryScreen = () => {
    const navigation = useNavigation();
    const { loading, filtered, selectedMonth, selectedType, selectedCategory, setSelectedMonth, setSelectedType, setSelectedCategory, exportPDF,
    } = useHistoryViewModel();

    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(
                collection(db, "categories"),
                where("userId", "==", user.uid)
            );

            const snap = await getDocs(q);
            setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        load();
    }, []);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

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


    // Calcular totales
    const totals = filtered.reduce(
        (acc, item) => {
            if (item.type === "Ingreso") {
                acc.income += Math.abs(Number(item.amount));
            } else {
                acc.expense += Math.abs(Number(item.amount));
            }
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;

    return (
        <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
            {/* HEADER */}
            <LinearGradient
                colors={["#1E40AF", "#3B82F6"]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    {/*  Botón de volver */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={28} color="#FFF" />
                    </TouchableOpacity>

                    {/* Título */}
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="time-outline" size={26} color="#FFF" />
                        <Text style={styles.headerTitle}>Historial</Text>
                    </View>

                    {/* Botón Exportar */}
                    <TouchableOpacity style={styles.exportButton} onPress={exportPDF}>
                        <Ionicons name="download-outline" size={20} color="#1E40AF" />
                        <Text style={styles.exportText}>Exportar</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>


            {/* Resumen */}
            {filtered.length > 0 && (
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Resumen</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: "#10B981" }]}>
                                +${totals.income.toLocaleString("es-CO")}
                            </Text>
                            <Text style={styles.summaryLabel}>Ingresos</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
                                -${totals.expense.toLocaleString("es-CO")}
                            </Text>
                            <Text style={styles.summaryLabel}>Gastos</Text>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text
                                style={[
                                    styles.summaryValue,
                                    { color: balance >= 0 ? "#10B981" : "#EF4444" },
                                ]}
                            >
                                ${balance.toLocaleString("es-CO")}
                            </Text>
                            <Text style={styles.summaryLabel}>Balance</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* FILTROS */}
            <View style={styles.filtersSection}>
                <Text style={styles.filtersTitle}>Filtrar por</Text>

                <View style={styles.filtersRow}>
                    {/* Mes */}
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedMonth !== null && styles.filterChipActive,
                        ]}
                        onPress={() => setShowMonthModal(true)}
                    >
                        <Ionicons name="calendar" size={18} color="#FFF" />
                        <Text style={styles.filterChipText}>
                            {selectedMonth !== null ? months[selectedMonth] : "Mes"}
                        </Text>
                    </TouchableOpacity>

                    {/* Tipo */}
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedType !== "all" && styles.filterChipActive,
                        ]}
                        onPress={() => {
                            if (selectedType === "all") setSelectedType("Ingreso");
                            else if (selectedType === "Ingreso") setSelectedType("Gasto");
                            else setSelectedType("all");
                        }}
                    >
                        <Ionicons name="swap-vertical" size={18} color="#FFF" />
                        <Text style={styles.filterChipText}>
                            {selectedType === "all"
                                ? "Tipo"
                                : selectedType === "Ingreso"
                                    ? "Ingresos"
                                    : "Gastos"}
                        </Text>
                    </TouchableOpacity>

                    {/* Categoría */}
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedCategory !== null && styles.filterChipActive,
                        ]}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <Ionicons name="pricetag" size={18} color="#FFF" />
                        <Text style={styles.filterChipText}>
                            {selectedCategory
                                ? categories.find((c) => c.id === selectedCategory)?.name
                                : "Categoría"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* LISTA */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1E40AF" />
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={60} color="#CCC" />
                    <Text>No hay movimientos</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.transactionCard}>
                            <View style={styles.transactionLeft}>
                                <View
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: item.color || "#999" },
                                    ]}
                                />

                                <View>
                                    <Text style={styles.transactionCategory}>
                                        {item.category}
                                    </Text>

                                    <Text style={styles.transactionDate}>
                                        {formatLocalDate(item.date)}
                                    </Text>

                                    {item.title ? (
                                        <Text style={styles.transactionTitle}>
                                            {item.title}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>

                            <Text
                                style={[
                                    styles.transactionAmount,
                                    { color: item.type === "Ingreso" ? "#10B981" : "#EF4444" },
                                ]}
                            >
                                {item.type === "Ingreso" ? "+" : "-"}$
                                {item.amount.toLocaleString("es-CO")}
                            </Text>
                        </View>
                    )}
                />
            )}

            {/* MODAL DE MESES */}
            <Modal visible={showMonthModal} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMonthModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {months.map((m, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedMonth(i);
                                        setShowMonthModal(false);
                                    }}
                                >
                                    <Text>{m}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setSelectedMonth(null);
                                setShowMonthModal(false);
                            }}
                        >
                            <Text style={styles.clearButtonText}>Limpiar filtro</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* MODAL DE CATEGORÍAS */}
            <Modal visible={showCategoryModal} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedCategory(cat.id);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <Text>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setSelectedCategory(null);
                                setShowCategoryModal(false);
                            }}
                        >
                            <Text style={styles.clearButtonText}>Limpiar filtro</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
    },
    exportButton: {
        backgroundColor: "#FFF",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },
    exportText: {
        fontWeight: "bold",
        color: "#1E40AF",
    },

    summaryCard: {
        margin: 20,
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        elevation: 2,
    },
    summaryTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    summaryItem: {
        alignItems: "center",
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: "bold",
    },
    summaryLabel: {
        fontSize: 12,
        color: "#555",
    },

    filtersSection: {
        paddingHorizontal: 20,
    },
    filtersTitle: {
        color: "#6B7280",
        marginBottom: 10,
        fontWeight: "600",
    },
    filtersRow: {
        flexDirection: "row",
        gap: 10,
    },
    filterChip: {
        backgroundColor: "#1E40AF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: "#3B82F6",
    },
    filterChipText: {
        color: "#FFF",
        fontWeight: "600",
    },

    listContent: {
        padding: 20,
    },
    transactionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: 14,
        borderRadius: 10,
        marginBottom: 14,
    },
    transactionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    transactionTitle: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    colorCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        marginRight: 12,
    },
    transactionCategory: {
        fontWeight: "600",
        fontSize: 15,
    },
    transactionDate: {
        fontSize: 12,
        color: "#777",
    },
    transactionAmount: {
        fontWeight: "bold",
        fontSize: 16,
    },

    // Modals
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        backgroundColor: "#FFF",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },
    modalItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#EEE",
    },
    clearButton: {
        padding: 14,
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    clearButtonText: {
        color: "#EF4444",
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
});
