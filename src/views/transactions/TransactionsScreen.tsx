import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
    Alert,
    Image,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; // AntDesign ya no es necesario, usaremos MaterialIcons para 'add'

// ... (mockTransactions se mantiene igual)

const mockTransactions = [
    {
        id: 't1',
        title: 'Cena en Restaurante',
        amount: -55.50,
        type: 'Gasto',
        date: '2025-10-05',
        category: 'Alimentación',
        image: 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=R',
    },
    {
        id: 't3',
        title: 'Boleto de Bus',
        amount: -3.00,
        type: 'Gasto',
        date: '2025-10-06',
        category: 'Transporte',
        image: 'https://via.placeholder.com/50/45B7D1/FFFFFF?text=R',
    },
    {
        id: 't4',
        title: 'Compra de Ropa',
        amount: -120.99,
        type: 'Gasto',
        date: '2025-10-07',
        category: 'Ropa',
        image: 'https://via.placeholder.com/50/FFEAA7/333333?text=R',
    },
];

export const TransactionsScreen = ({ navigation }: any) => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    // ... (openMenu, closeMenu, handleEdit, handleDelete se mantienen igual)
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
            `¿Estás seguro de eliminar "${transactionToDelete.title}" de ${transactionToDelete.amount}?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Sí, Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
                        Alert.alert('Eliminado', `La transacción "${transactionToDelete.title}" ha sido eliminada.`);
                    },
                },
            ]
        );
    };

    // RF10: Componente para renderizar cada transacción (se mantiene igual)
    const renderItem = ({ item }: { item: any }) => {
        const isExpense = item.type === 'Gasto';
        const amountStyle = isExpense ? styles.expenseText : styles.incomeText;

        return (
            <View style={styles.transactionItem}>
                {/* Imagen/Icono */}
                <Image source={{ uri: item.image }} style={styles.transactionImage} />

                {/* Detalles de la transacción */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.transactionCategory}>{item.category} • {item.date}</Text>
                </View>

                {/* Monto */}
                <Text style={[styles.transactionAmount, amountStyle]}>
                    {isExpense ? '-' : '+'} ${Math.abs(item.amount).toFixed(2)}
                </Text>

                {/* Botón de opciones */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => openMenu(item)}
                >
                    <MaterialIcons name="more-vert" size={24} color="#888" />
                </TouchableOpacity>
            </View>
        );
    };

    // RF11: Acción del botón "+Agregar"
    const handleAddTransaction = () => {
        navigation.navigate('Agregar Transacción');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Transacciones</Text>
                {/* 1. Botón de agregar movido al header, igual que en CategoriesScreen */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTransaction}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

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

            {/* 2. El Modal y su lógica se mantienen igual */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={closeMenu}
                >
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
        paddingTop: 60,
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
    }
});