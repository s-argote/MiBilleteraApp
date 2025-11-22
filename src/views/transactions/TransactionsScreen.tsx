import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useFocusEffect } from '@react-navigation/native';

export const TransactionsScreen = ({ navigation }: any) => {
    const { transactions, loading, deleteTransaction, loadTransactions } = useTransactionViewModel();
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    // ➕ Nuevo: estado para ver imagen grande
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [imageToView, setImageToView] = useState<string | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            loadTransactions();
        }, [])
    );

    const openMenu = (transaction: any) => {
        setSelectedTransaction(transaction);
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
        setSelectedTransaction(null);
    };

    const handleEdit = () => {
        if (!selectedTransaction) return;
        closeMenu();
        navigation.navigate('Editar Transacción', { transaction: selectedTransaction });
    };

    const formatLocalDate = (dateString: string) => {
        if ((dateString as any)?.toDate) {
            const d = (dateString as any).toDate();
            return new Intl.DateTimeFormat('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(d);
        }

        const [year, month, day] = dateString.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(localDate);
    };

    const handleDelete = () => {
        if (!selectedTransaction) return;
        const transactionToDelete = selectedTransaction;
        closeMenu();

        Alert.alert(
            '¿Eliminar transacción?',
            `Se eliminará "${transactionToDelete.title}" por $${Math.abs(transactionToDelete.amount).toLocaleString('es-CO')}`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteTransaction(transactionToDelete.id);
                        Alert.alert('¡Eliminado!', 'La transacción ha sido eliminada.');
                    },
                },
            ]
        );
    };

    const totals = transactions.reduce(
        (acc, item) => {
            if (item.type === 'Ingreso') {
                acc.income += Math.abs(item.amount);
            } else {
                acc.expense += Math.abs(item.amount);
            }
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const renderItem = ({ item }: { item: any }) => {
        const isExpense = item.type === 'Gasto';

        return (
            <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.7}
                onLongPress={() => openMenu(item)}
            >
                <View
                    style={[
                        styles.transactionIconContainer,
                        { backgroundColor: isExpense ? '#FEF2F2' : '#ECFDF5' }
                    ]}
                >
                    {item.image ? (
                        <TouchableOpacity
                            onPress={() => {
                                setImageToView(item.image);
                                setImageModalVisible(true);
                            }}
                        >
                            <Image source={{ uri: item.image }} style={styles.transactionImage} />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.transactionEmoji}>
                            {isExpense ? '💸' : '💰'}
                        </Text>
                    )}
                </View>

                <View style={styles.transactionContent}>
                    <View style={styles.transactionHeader}>
                        <Text style={styles.transactionTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text
                            style={[
                                styles.transactionAmount,
                                { color: isExpense ? '#EF4444' : '#10B981' }
                            ]}
                        >
                            {isExpense ? '-' : '+'}$
                            {Math.abs(item.amount).toLocaleString('es-CO')}
                        </Text>
                    </View>

                    <View style={styles.transactionFooter}>
                        <View style={styles.categoryBadge}>
                            <View
                                style={[
                                    styles.categoryDot,
                                    { backgroundColor: item.color || '#9CA3AF' }
                                ]}
                            />
                            <Text style={styles.categoryText} numberOfLines={1}>
                                {item.category}
                            </Text>
                        </View>

                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                            <Text style={styles.dateText}>{formatLocalDate(item.date)}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => openMenu(item)}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="receipt" size={28} color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Mis Transacciones</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <Text style={styles.statsText}>{transactions.length} registros</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* RESUMEN */}
            {transactions.length > 0 && (
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryItem}>
                            <Ionicons name="arrow-down-circle" size={20} color="#10B981" />
                            <View>
                                <Text style={styles.summaryLabel}>Ingresos</Text>
                                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                                    ${totals.income.toLocaleString('es-CO')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Ionicons name="arrow-up-circle" size={20} color="#EF4444" />
                            <View>
                                <Text style={styles.summaryLabel}>Gastos</Text>
                                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                                    ${totals.expense.toLocaleString('es-CO')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* BOTÓN AGREGAR */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => navigation.navigate('Agregar Transacción')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </LinearGradient>
            </TouchableOpacity>

            {/* LISTA */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Cargando transacciones...</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* === MODAL MENÚ === */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeMenu}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIndicator} />
                        </View>

                        {selectedTransaction && (
                            <View style={styles.transactionPreview}>
                                <View
                                    style={[
                                        styles.previewIcon,
                                        {
                                            backgroundColor: selectedTransaction.type === 'Gasto'
                                                ? '#FEF2F2'
                                                : '#ECFDF5'
                                        }
                                    ]}
                                >
                                    <Text style={styles.previewEmoji}>
                                        {selectedTransaction.type === 'Gasto' ? '💸' : '💰'}
                                    </Text>
                                </View>
                                <View style={styles.previewInfo}>
                                    <Text style={styles.previewTitle}>
                                        {selectedTransaction.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.previewAmount,
                                            {
                                                color: selectedTransaction.type === 'Gasto'
                                                    ? '#EF4444'
                                                    : '#10B981'
                                            }
                                        ]}
                                    >
                                        {selectedTransaction.type === 'Gasto' ? '-' : '+'}$
                                        {Math.abs(selectedTransaction.amount).toLocaleString('es-CO')}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.menuOptions}>
                            <TouchableOpacity style={styles.menuOption} onPress={handleEdit}>
                                <View style={[styles.menuIconContainer, { backgroundColor: '#EEF2FF' }]}>
                                    <Ionicons name="create-outline" size={24} color="#1E40AF" />
                                </View>
                                <View style={styles.menuOptionContent}>
                                    <Text style={styles.menuOptionTitle}>Editar</Text>
                                    <Text style={styles.menuOptionSubtitle}>Modificar detalles de transacción</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <View style={styles.menuDivider} />

                            <TouchableOpacity style={styles.menuOption} onPress={handleDelete}>
                                <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
                                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                                </View>
                                <View style={styles.menuOptionContent}>
                                    <Text style={[styles.menuOptionTitle, { color: '#EF4444' }]}>
                                        Eliminar
                                    </Text>
                                    <Text style={styles.menuOptionSubtitle}>Borrar transacción permanentemente</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.cancelButton} onPress={closeMenu}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* === MODAL DE IMAGEN GRANDE === */}
            <Modal
                visible={imageModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.fullscreenOverlay}>

                    {/* Cerrar tocando fuera */}
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => setImageModalVisible(false)}
                    />

                    {/* Imagen centrada */}
                    <Image
                        source={{ uri: imageToView! }}
                        style={styles.fullscreenImage}
                        resizeMode="contain"
                    />

                    {/* Botón de cerrar */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>

                </View>
            </Modal>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerStats: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    summaryContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    fabButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    transactionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    transactionEmoji: {
        fontSize: 28,
    },
    transactionContent: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    transactionFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    moreButton: {
        padding: 8,
        marginLeft: 4,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
    },
    modalHeader: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    modalIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
    },
    transactionPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    previewIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewEmoji: {
        fontSize: 32,
    },
    previewInfo: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    previewAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    fullscreenOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '90%',
        height: '70%',
        borderRadius: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 30,
    },

    menuOptions: {
        paddingHorizontal: 20,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuOptionContent: {
        flex: 1,
    },
    menuOptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    menuOptionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    cancelButton: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});
