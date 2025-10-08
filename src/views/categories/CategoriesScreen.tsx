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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const mockCategories = [
    { id: '1', name: 'Alimentación', color: '#FF6B6B' },
    { id: '2', name: 'Transporte', color: '#4ECDC4' },
    { id: '3', name: 'Entretenimiento', color: '#45B7D1' },
    { id: '4', name: 'Salud', color: '#96CEB4' },
    { id: '5', name: 'Ropa', color: '#FFEAA7' },
    { id: '6', name: 'Otros', color: '#DDA0DD' },
];

export const CategoriesScreen = ({ navigation }: any) => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = (category: any) => {
        setSelectedCategory(category);
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
        setSelectedCategory(null);
    };

    const handleEdit = () => {
        if (!selectedCategory) return;
        closeMenu();
        navigation.navigate('Editar Categoría', { category: selectedCategory });
    };

    const handleDelete = () => {
        if (!selectedCategory) return;
        Alert.alert(
            'Eliminar categoría',
            `¿Estás seguro de eliminar "${selectedCategory.name}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Eliminado', `${selectedCategory.name} fue eliminada.`);
                        closeMenu();
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.categoryItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.categoryName}>{item.name}</Text>

            {/* Botón de tres puntos */}
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => openMenu(item)}
            >
                <MaterialIcons name="more-vert" size={24} color="#888" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Categorías</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Nueva Categoría')}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={mockCategories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* Menú contextual */}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingTop: 60,
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
        width: 24,
        height: 24,
        borderRadius: 4,
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
});