import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BudgetService } from '../../services/BudgetService';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const adjustColorBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

export const BudgetsScreen = () => {
    const navigation = useNavigation<any>();
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const { categories } = useCategoryViewModel();
    const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});

    useEffect(() => {
        (async () => {
            const b = await BudgetService.getBudgetForMonth(month);
            if (b) {
                setMonthlyBudget(String(b.monthlyBudget || ''));
                setCategoryBudgets(Object.fromEntries(Object.entries(b.categoryBudgets || {}).map(([k, v]) => [k, String(v)])));
            } else {
                setMonthlyBudget('');
                setCategoryBudgets({});
            }
        })();
    }, [month]);

    const [saving, setSaving] = useState(false);

    const save = async () => {
        if (saving) return; // evita doble clic

        try {
            setSaving(true);
            await BudgetService.setBudgetForMonth(month, {
                monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : 0,
                categoryBudgets: Object.fromEntries(
                    Object.entries(categoryBudgets).map(([k, v]) => [k, parseFloat(v) || 0])
                )
            });

            Alert.alert('¡Éxito!', 'Presupuestos guardados correctamente.');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo guardar el presupuesto.');
        } finally {
            setSaving(false);
        }
    };

    const totalCategoryBudgets = Object.values(categoryBudgets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const monthlyBudgetNum = parseFloat(monthlyBudget) || 0;
    const budgetDifference = monthlyBudgetNum - totalCategoryBudgets;

    const getMonthName = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Mi Cuenta")}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerLeft}>
                        <Ionicons name="wallet" size={28} color="#FFFFFF" />
                        <View>
                            <Text style={styles.headerTitle}>Presupuestos</Text>
                            <Text style={styles.headerSubtitle}>{getMonthName(month)}</Text>
                        </View>
                    </View>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Monthly Budget Card */}
                <View style={styles.monthlyBudgetCard}>
                    <LinearGradient
                        colors={['#8B5CF6', '#6366F1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.monthlyBudgetGradient}
                    >
                        <View style={styles.monthlyBudgetHeader}>
                            <View style={styles.monthlyIconContainer}>
                                <Ionicons name="cash" size={28} color="#FFFFFF" />
                            </View>
                            <Text style={styles.monthlyBudgetLabel}>Presupuesto Mensual Total</Text>
                        </View>
                        <View style={styles.monthlyInputWrapper}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                keyboardType="numeric"
                                value={monthlyBudget}
                                onChangeText={setMonthlyBudget}
                                style={styles.monthlyInput}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                        </View>
                    </LinearGradient>
                </View>

                {/* Budget Summary Card */}
                {monthlyBudgetNum > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <Ionicons name="analytics" size={20} color="#1E40AF" />
                            <Text style={styles.summaryTitle}>Resumen de Presupuesto</Text>
                        </View>
                        <View style={styles.summaryContent}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total asignado</Text>
                                <Text style={[styles.summaryValue, { color: '#6366F1' }]}>
                                    ${monthlyBudgetNum.toLocaleString('es-CO')}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Distribuido en categorías</Text>
                                <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
                                    ${totalCategoryBudgets.toLocaleString('es-CO')}
                                </Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabelBold}>
                                    {budgetDifference >= 0 ? 'Disponible' : 'Excedido'}
                                </Text>
                                <Text style={[
                                    styles.summaryValueBold,
                                    { color: budgetDifference >= 0 ? '#10B981' : '#EF4444' }
                                ]}>
                                    ${Math.abs(budgetDifference).toLocaleString('es-CO')}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Categories Section */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Ionicons name="grid" size={20} color="#1E40AF" />
                            <Text style={styles.sectionTitle}>Presupuestos por Categoría</Text>
                        </View>
                        <View style={styles.categoryCountBadge}>
                            <Text style={styles.categoryCountText}>{categories.length}</Text>
                        </View>
                    </View>

                    {categories.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="folder-open-outline" size={60} color="#D1D5DB" />
                            </View>
                            <Text style={styles.emptyTitle}>No hay categorías</Text>
                            <Text style={styles.emptyText}>
                                Crea categorías para asignar presupuestos específicos
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.categoriesList}>
                            {categories.map(cat => {
                                const budget = parseFloat(categoryBudgets[cat.id] || '0');
                                const percentage = monthlyBudgetNum > 0
                                    ? (budget / monthlyBudgetNum * 100).toFixed(0)
                                    : 0;

                                return (
                                    <View key={cat.id} style={styles.categoryCard}>
                                        <View style={styles.categoryHeader}>
                                            <View style={styles.categoryLeft}>
                                                <View style={[
                                                    styles.categoryIconContainer,
                                                    { backgroundColor: cat.color || '#3B82F6' }
                                                ]}>
                                                    <Text style={styles.categoryIcon}>{cat.icon || '📁'}</Text>
                                                </View>
                                                <View style={styles.categoryInfo}>
                                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                                    {budget > 0 && monthlyBudgetNum > 0 && (
                                                        <Text style={styles.categoryPercentage}>
                                                            {percentage}% del total
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.categoryInputContainer}>
                                            <Text style={styles.categoryInputLabel}>$</Text>
                                            <TextInput
                                                style={styles.categoryInput}
                                                keyboardType="numeric"
                                                value={categoryBudgets[cat.id] || ''}
                                                onChangeText={(v) => setCategoryBudgets(prev => ({ ...prev, [cat.id]: v }))}
                                                placeholder="0"
                                                placeholderTextColor="#9CA3AF"
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Consejo</Text>
                        <Text style={styles.infoText}>
                            Asigna presupuestos a cada categoría para controlar mejor tus gastos mensuales.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={save}
                    disabled={saving}
                    style={[styles.saveButton, saving && { opacity: 0.5 }]}
                    activeOpacity={0.8}
                >

                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                        <Text style={styles.saveButtonText}>
                            {saving ? "Guardando..." : "Guardar Presupuestos"}
                        </Text>

                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        textTransform: 'capitalize',
    },

    // Content
    content: {
        padding: 20,
        paddingBottom: 120,
    },

    // Monthly Budget Card
    monthlyBudgetCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    monthlyBudgetGradient: {
        padding: 24,
    },
    monthlyBudgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    monthlyIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthlyBudgetLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.95)',
        fontWeight: '600',
    },
    monthlyInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 4,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 8,
    },
    monthlyInput: {
        flex: 1,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 12,
    },

    // Summary Card
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    summaryContent: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    summaryLabelBold: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '700',
    },
    summaryValueBold: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Categories Section
    categoriesSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    categoryCountBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    categoryCountText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E40AF',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    emptyIconContainer: {
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
        paddingHorizontal: 40,
    },

    // Categories List
    categoriesList: {
        gap: 12,
    },
    categoryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    categoryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIcon: {
        fontSize: 22,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    categoryPercentage: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    categoryInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    categoryInputLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6B7280',
        marginRight: 8,
    },
    categoryInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },

    // Info Card
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    infoIconContainer: {
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },

    // Button Container
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});