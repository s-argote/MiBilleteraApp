import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useFocusEffect } from '@react-navigation/native';

export const TransactionsScreen = ({ navigation }: any) => {
    const { transactions, loading, deleteTransaction, loadTransactions } = useTransactionViewModel();
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadTransactions(); // Recarga cada vez que la pantalla se muestra
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

    const handleDelete = () => {
        if (!selectedTransaction) return;
        const transactionToDelete = selectedTransaction;
        closeMenu();

        Alert.alert(
            'Eliminar Transacción',
            `¿Estás seguro de eliminar la transacción "${transactionToDelete.title}" de ${transactionToDelete.amount}?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteTransaction(transactionToDelete.id);
                        Alert.alert('Eliminado', `La transacción "${transactionToDelete.title}" ha sido eliminada.`);
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isExpense = item.type === 'Gasto';
        const amountStyle = isExpense ? styles.expenseText : styles.incomeText;

        return (
            <View style={styles.transactionItem}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/50/ccc/333?text=IMG' }} style={styles.transactionImage} />
                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.transactionTitle, { flex: 1 }]} numberOfLines={1}>{item.title}</Text>
                        <View style={[styles.categoryColorCircle, { backgroundColor: item.color || '#ccc' }]} />
                    </View>
                    <Text style={styles.transactionCategory}>{item.category} • {item.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, amountStyle]}>
                    {isExpense ? '-' : '+'} ${Math.abs(item.amount).toLocaleString('es-CO')}
                </Text>
                <TouchableOpacity style={styles.menuButton} onPress={() => openMenu(item)}>
                    <MaterialIcons name="more-vert" size={24} color="#888" />
                </TouchableOpacity>
            </View>
        );
    };

    const handleAddTransaction = () => {
        navigation.navigate('Agregar Transacción');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Transacciones</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
                            <Text style={styles.emptyText}>¡Comienza agregando una!</Text>
                        </View>
                    )}
                />
            )}

            <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
                <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuOption} onPress={handleEdit}>
                            <Text style={styles.menuOptionText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuOption} onPress={handleDelete}>
                            <Text style={[styles.menuOptionText, styles.deleteText]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        // Ajustado para contener el título y el botón
        flexDirection: 'row', // Permite elementos lado a lado
        justifyContent: 'space-between', // Espacia el título y el botón
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20, // Ajustado para coincidir con CategoriesScreen
        fontWeight: '600', // Ajustado para coincidir con CategoriesScreen
        color: '#333',
    },
    // 3. Estilo de botón de agregar copiado de CategoriesScreen
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    transactionImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
        backgroundColor: '#ccc', // Placeholder color
    },
    detailsContainer: {
        flex: 1,
        marginRight: 10,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    transactionCategory: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 'auto',
    },
    incomeText: {
        color: '#4CAF50', // Verde para Ingreso
    },
    expenseText: {
        color: '#F44336', // Rojo para Gasto
    },
    menuButton: {
        padding: 8,
        marginLeft: 4,
    },
    // 4. Se elimina el estilo floatingButton

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    menuOption: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuOptionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    deleteText: {
        color: '#FF3B30',
        fontWeight: '600',
    },
    emptyContainer: {
        paddingTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    categoryColorCircle: {
        width: 20,
        height: 20,
        borderRadius: 10, // Para hacerlo circular
        marginLeft: 8, // Espacio entre el título y el círculo
    },
});