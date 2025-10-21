import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

/**
 * Pantalla principal de Gestión de Categorías.
 * Muestra una lista de categorías y permite agregar, editar o eliminar.
 */
export const CategoriesScreen = ({ navigation }: any) => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const { categories, loading, deleteCategory, loadCategories } = useCategoryViewModel();

    // Recarga las categorías cada vez que la pantalla gana el foco.
    useFocusEffect(
        React.useCallback(() => {
            loadCategories();
        }, [])
    );

    /**
     * Abre el menú de opciones para una categoría específica.
     * @param {Object} category - Categoría seleccionada.
     */
    const openMenu = (category: any) => {
        setSelectedCategory(category);
        setMenuVisible(true);
    };

    /**
     * Cierra el menú de opciones.
     */
    const closeMenu = () => {
        setMenuVisible(false);
        setSelectedCategory(null);
    };

    /**
     * Navega a la pantalla de edición de la categoría seleccionada.
     */
    const handleEdit = () => {
        if (!selectedCategory) return;
        closeMenu();
        navigation.navigate('Editar Categoría', { category: selectedCategory });
    };

    /**
     * Muestra un cuadro de diálogo para confirmar la eliminación de la categoría.
     */
    const handleDelete = () => {
        if (!selectedCategory) return;
        const categoryToDelete = selectedCategory;
        closeMenu();

        Alert.alert(
            'Eliminar categoría',
            `¿Estás seguro de eliminar la categoría "${categoryToDelete.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteCategory(categoryToDelete.id);
                        Alert.alert('Eliminado', `La categoría "${categoryToDelete.name}" ha sido eliminada.`);
                    },
                },
            ]
        );
    };

    /**
     * Renderiza cada ítem de la lista.
     */
    const renderItem = ({ item }: { item: any }) => (
        <View key={item.id} style={styles.categoryItem}>
            {/* Cuadro de color */}
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.categoryName}>{item.name}</Text>
            {/* Botón de menú */}
            <TouchableOpacity style={styles.menuButton} onPress={() => openMenu(item)}>
                <MaterialIcons name="more-vert" size={24} color="#888" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>Mis Categorías</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Nueva Categoría')}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Lista de categorías */}
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay categorías registradas.</Text>
                            <Text style={styles.emptyText}>¡Comienza agregando una!</Text>
                        </View>
                    )}
                />
            )}

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
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

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',

    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
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
    categoryItem: {
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
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 16,
    },
    categoryName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    menuButton: {
        padding: 8,
    },
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
});