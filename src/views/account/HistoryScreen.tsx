import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHistoryViewModel } from "../../viewmodels/HistoryViewModel";
import { db } from "../../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../../services/firebase";
export const HistoryScreen = () => {
   const {
       loading,
       filtered,
       selectedMonth,
       selectedType,
       selectedCategory,
       setSelectedMonth,
       setSelectedType,
       setSelectedCategory,
   } = useHistoryViewModel();
   const [showMonthModal, setShowMonthModal] = useState(false);
   const [showCategoryModal, setShowCategoryModal] = useState(false);
   const [categories, setCategories] = useState<any[]>([]);
   /**  Cargar solo categorías del usuario */
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
   return (
<SafeAreaView style={styles.container}>
<Text style={styles.title}>Historial de Movimientos</Text>
           {/* FILTROS */}
<View style={styles.filtersRow}>
               {/* Filtro Mes */}
<TouchableOpacity
                   style={styles.filterButton}
                   onPress={() => setShowMonthModal(true)}
>
<Ionicons name="calendar-outline" size={18} />
<Text style={styles.filterText}>
                       {selectedMonth !== null ? months[selectedMonth] : "Mes"}
</Text>
</TouchableOpacity>
               {/* Filtro Tipo */}
<TouchableOpacity
                   style={styles.filterButton}
                   onPress={() => {
                       if (selectedType === "all") setSelectedType("Ingreso");
                       else if (selectedType === "Ingreso") setSelectedType("Gasto");
                       else setSelectedType("all");
                   }}
>
<Ionicons name="swap-vertical" size={18} />
<Text style={styles.filterText}>
                       {selectedType === "all"
                           ? "Todos"
                           : selectedType === "Ingreso"
                               ? "Ingresos"
                               : "Gastos"}
</Text>
</TouchableOpacity>
               {/* Filtro Categoría */}
<TouchableOpacity
                   style={styles.filterButton}
                   onPress={() => setShowCategoryModal(true)}
>
<Ionicons name="pricetag-outline" size={18} />
<Text style={styles.filterText}>
                       {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Categoría"}
</Text>
</TouchableOpacity>
</View>
           {/* LISTA */}
           {loading ? (
<ActivityIndicator size="large" color="#007AFF" />
           ) : filtered.length === 0 ? (
<Text style={styles.noData}>No hay movimientos</Text>
           ) : (
<FlatList
                   data={filtered}
                   keyExtractor={(item) => item.id}
                   renderItem={({ item }) => (
<View style={styles.item}>
<View style={styles.leftSide}>
<View style={[styles.dot, { backgroundColor: item.color }]} />
<View>
<Text style={styles.category}>{item.category}</Text>
<Text style={styles.date}>
                                       {new Date(item.date).toLocaleDateString()}
</Text>
</View>
</View>
<Text
                               style={[
                                   styles.amount,
                                   { color: item.type === "Ingreso" ? "#10B981" : "#EF4444" }
                               ]}
>
                               {item.type === "Ingreso" ? "+" : "-"}$
                               {item.amount.toLocaleString("es-CO")}
</Text>
</View>
                   )}
               />
           )}
           {/*  MODAL MESES CON SCROLL */}
           {showMonthModal && (
<View style={styles.modalOverlay}>
<View style={styles.modalBox}>
<Text style={styles.modalTitle}>Selecciona un mes</Text>
<ScrollView style={{ maxHeight: 300 }}>
                           {months.map((m, index) => (
<TouchableOpacity
                                   key={index}
                                   style={styles.modalItem}
                                   onPress={() => {
                                       setSelectedMonth(index);
                                       setShowMonthModal(false);
                                   }}
>
<Text style={styles.modalText}>{m}</Text>
</TouchableOpacity>
                           ))}
</ScrollView>
<TouchableOpacity
                           style={[styles.modalItem, { marginTop: 10 }]}
                           onPress={() => {
                               setSelectedMonth(null);
                               setShowMonthModal(false);
                           }}
>
<Text style={[styles.modalText, { color: "red" }]}>
                               Quitar filtro
</Text>
</TouchableOpacity>
</View>
</View>
           )}
           {/*  MODAL CATEGORÍAS CON USUARIO CORRECTO */}
           {showCategoryModal && (
<View style={styles.modalOverlay}>
<View style={styles.modalBox}>
<Text style={styles.modalTitle}>Selecciona una categoría</Text>
<ScrollView style={{ maxHeight: 300 }}>
                           {categories.length > 0 ? (
                               categories.map((cat) => (
<TouchableOpacity
                                       key={cat.id}
                                       style={styles.modalItem}
                                       onPress={() => {
                                           setSelectedCategory(cat.id);
                                           setShowCategoryModal(false);
                                       }}
>
<Text style={styles.modalText}>{cat.name}</Text>
</TouchableOpacity>
                               ))
                           ) : (
<Text style={{ textAlign: "center", marginTop: 10 }}>
                                   No tienes categorías creadas
</Text>
                           )}
</ScrollView>
<TouchableOpacity
                           style={[styles.modalItem, { marginTop: 10 }]}
                           onPress={() => {
                               setSelectedCategory(null);
                               setShowCategoryModal(false);
                           }}
>
<Text style={[styles.modalText, { color: "red" }]}>
                               Quitar filtro
</Text>
</TouchableOpacity>
</View>
</View>
           )}
</SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
   title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
   filtersRow: {
       flexDirection: "row",
       justifyContent: "space-between",
       marginBottom: 15,
   },
   filterButton: {
       flexDirection: "row",
       alignItems: "center",
       paddingVertical: 8,
       paddingHorizontal: 12,
       borderRadius: 10,
       backgroundColor: "#F4F4F5",
   },
   filterText: { marginLeft: 6, fontSize: 14 },
   noData: { textAlign: "center", marginTop: 40, color: "#666" },
   item: {
       flexDirection: "row",
       justifyContent: "space-between",
       paddingVertical: 14,
       borderBottomWidth: 1,
       borderColor: "#eee",
   },
   leftSide: { flexDirection: "row", alignItems: "center" },
   dot: {
       width: 12,
       height: 12,
       borderRadius: 6,
       marginRight: 10,
   },
   category: { fontSize: 16, fontWeight: "600" },
   date: { fontSize: 12, color: "#777" },
   amount: { fontSize: 16, fontWeight: "bold" },
   modalOverlay: {
       position: "absolute",
       top: 0,
       bottom: 0,
       left: 0,
       right: 0,
       backgroundColor: "rgba(0,0,0,0.4)",
       justifyContent: "center",
       alignItems: "center",
   },
   modalBox: {
       width: "85%",
       backgroundColor: "#fff",
       borderRadius: 12,
       padding: 20,
       maxHeight: "75%",
   },
   modalTitle: {
       fontSize: 18,
       fontWeight: "bold",
       marginBottom: 10,
       textAlign: "center",
   },
   modalItem: { paddingVertical: 12 },
   modalText: { fontSize: 16, textAlign: "center" },
});