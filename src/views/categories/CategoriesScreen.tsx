import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

export const CategoriesScreen = ({ navigation }: any) => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const { categories, loading, deleteCategory, loadCategories } = useCategoryViewModel();

    useFocusEffect(
        React.useCallback(() => {
            loadCategories();
        }, [])
    );

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
        const categoryToDelete = selectedCategory;
        closeMenu();

        Alert.alert(
            '¿Eliminar categoría?',
            `Se eliminará "${categoryToDelete.name}" y todas sus transacciones asociadas.`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteCategory(categoryToDelete.id);
                        Alert.alert(
                            '¡Eliminado!',
                            `"${categoryToDelete.name}" ha sido eliminada.`
                        );
                    },
                },
            ]
        );
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            activeOpacity={0.7}
            onLongPress={() => openMenu(item)}
        >
            <LinearGradient
                colors={[item.color || '#3B82F6', adjustColorBrightness(item.color || '#3B82F6', -20)]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
            >
                <View style={styles.categoryContent}>
                    <View style={styles.categoryIconContainer}>
                        <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
                    </View>
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <View style={styles.categoryMeta}>
                            <Ionicons name="pricetag" size={12} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.categoryCount}>
                                {item.transactionsCount || 0} transacciones
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => openMenu(item)}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
    );

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
                    <View style={styles.headerLeft}>
                        <Ionicons name="grid" size={28} color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Mis Categorías</Text>
                    </View>
                    <View style={styles.headerStats}>
                        <Text style={styles.statsText}>{categories.length} categorías</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Botón flotante de agregar */}
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => navigation.navigate('Nueva Categoría')}
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

            {/* Lista de categorías */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Cargando categorías...</Text>
                </View>
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.row}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="folder-open-outline" size={80} color="#D1D5DB" />
                            </View>
                            <Text style={styles.emptyTitle}>No hay categorías</Text>
                            <Text style={styles.emptySubtitle}>
                                Crea tu primera categoría para organizar tus transacciones
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('Nueva Categoría')}
                            >
                                <LinearGradient
                                    colors={['#1E40AF', '#3B82F6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.emptyButtonGradient}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                                    <Text style={styles.emptyButtonText}>Crear categoría</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* Modal de opciones */}
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

                        {selectedCategory && (
                            <View style={styles.categoryPreview}>
                                <View
                                    style={[
                                        styles.categoryPreviewIcon,
                                        { backgroundColor: selectedCategory.color || '#3B82F6' }
                                    ]}
                                >
                                    <Text style={styles.categoryPreviewEmoji}>
                                        {selectedCategory.icon || '📁'}
                                    </Text>
                                </View>
                                <View style={styles.categoryPreviewInfo}>
                                    <Text style={styles.categoryPreviewName}>
                                        {selectedCategory.name}
                                    </Text>
                                    <Text style={styles.categoryPreviewMeta}>
                                        {selectedCategory.transactionsCount || 0} transacciones
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={styles.menuOptions}>
                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={handleEdit}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: '#EEF2FF' }]}>
                                    <Ionicons name="create-outline" size={24} color="#1E40AF" />
                                </View>
                                <View style={styles.menuOptionContent}>
                                    <Text style={styles.menuOptionTitle}>Editar</Text>
                                    <Text style={styles.menuOptionSubtitle}>
                                        Modificar nombre o color de la categoría
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <View style={styles.menuDivider} />

                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={handleDelete}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
                                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                                </View>
                                <View style={styles.menuOptionContent}>
                                    <Text style={[styles.menuOptionTitle, { color: '#EF4444' }]}>
                                        Eliminar
                                    </Text>
                                    <Text style={styles.menuOptionSubtitle}>
                                        Borrar categoría y transacciones
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeMenu}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

// Función para ajustar el brillo del color
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

    // FAB Button
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

    // List
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'space-between',
    },

    // Category Card
    categoryCard: {
        flex: 1,
        maxWidth: '48%',
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryGradient: {
        padding: 16,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    categoryContent: {
        flex: 1,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryIcon: {
        fontSize: 24,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    categoryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    categoryCount: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    moreButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    emptyIconContainer: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    emptyButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 8,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Modal
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

    // Category Preview
    categoryPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    categoryPreviewIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryPreviewEmoji: {
        fontSize: 32,
    },
    categoryPreviewInfo: {
        flex: 1,
    },
    categoryPreviewName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    categoryPreviewMeta: {
        fontSize: 14,
        color: '#6B7280',
    },

    // Menu Options
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

    // Cancel Button
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