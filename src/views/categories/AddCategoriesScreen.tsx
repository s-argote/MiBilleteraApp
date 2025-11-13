import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

const COLOR_PALETTE = [
    { color: '#FF6B6B', name: 'Coral' },
    { color: '#4ECDC4', name: 'Turquesa' },
    { color: '#45B7D1', name: 'Azul Cielo' },
    { color: '#96CEB4', name: 'Verde Menta' },
    { color: '#FECA57', name: 'Amarillo' },
    { color: '#FF9FF3', name: 'Rosa' },
    { color: '#54A0FF', name: 'Azul' },
    { color: '#5F27CD', name: 'Púrpura' },
    { color: '#00D2D3', name: 'Cian' },
    { color: '#FF9F43', name: 'Naranja' },
    { color: '#10AC84', name: 'Verde' },
    { color: '#EE5A24', name: 'Rojo Fuego' }
];

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

export const AddCategoriesScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLOR_PALETTE[0].color);
    const [scaleAnim] = useState(new Animated.Value(1));

    const { addCategory } = useCategoryViewModel();

    const handleColorPress = (selectedColor: string) => {
        setColor(selectedColor);
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Nombre requerido', 'Por favor ingresa un nombre para la categoría.');
            return;
        }

        try {
            await addCategory(name, color);
            Alert.alert('¡Éxito!', 'Categoría guardada correctamente.');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo guardar la categoría.');
        }
    };

    return (
        <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nueva Categoría</Text>
                <View style={styles.headerRight} />
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Preview Card con gradiente */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View style={styles.previewCard}>
                        <LinearGradient
                            colors={[color, adjustColorBrightness(color, -20)]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.previewGradient}
                        >
                            <View style={styles.previewIconContainer}>
                                <Text style={styles.previewEmoji}>📁</Text>
                            </View>
                            <Text style={styles.previewText}>
                                {name.trim() || 'Nombre de categoría'}
                            </Text>
                            <View style={styles.previewMeta}>
                                <Ionicons name="pricetag" size={12} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.previewMetaText}>0 transacciones</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    {/* Nombre Input */}
                    <View style={styles.inputSection}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="text" size={20} color="#1E40AF" />
                            <Text style={styles.label}>Nombre de la categoría</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Alimentación, Transporte..."
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                                maxLength={30}
                            />
                            <Text style={styles.charCount}>{name.length}/30</Text>
                        </View>
                    </View>

                    {/* Color Picker */}
                    <View style={styles.inputSection}>
                        <View style={styles.labelContainer}>
                            <Ionicons name="color-palette" size={20} color="#1E40AF" />
                            <Text style={styles.label}>Color de la categoría</Text>
                        </View>
                        <View style={styles.selectedColorContainer}>
                            <View style={[styles.selectedColorDot, { backgroundColor: color }]} />
                            <Text style={styles.selectedColorName}>
                                {COLOR_PALETTE.find(c => c.color === color)?.name}
                            </Text>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.paletteContent}
                            style={styles.paletteScroll}
                        >
                            {COLOR_PALETTE.map((item) => (
                                <TouchableOpacity
                                    key={item.color}
                                    style={styles.colorWrapper}
                                    onPress={() => handleColorPress(item.color)}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={[item.color, adjustColorBrightness(item.color, -15)]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[
                                            styles.colorOption,
                                            color === item.color && styles.colorOptionSelected,
                                        ]}
                                    >
                                        {color === item.color && (
                                            <View style={styles.checkmark}>
                                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                            </View>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons name="information-circle" size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.infoText}>
                            Las categorías te ayudan a organizar y clasificar tus transacciones de forma efectiva.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[color, adjustColorBrightness(color, -20)]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.saveButtonGradient}
                    >
                        <Text style={styles.saveButtonText}>Guardar Categoría</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        width: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    // Scroll Content
    scrollContent: {
        padding: 20,
        paddingBottom: 140,
    },

    // Preview Card
    previewCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    previewGradient: {
        padding: 20,
        minHeight: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    previewEmoji: {
        fontSize: 32,
    },
    previewText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    previewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    previewMetaText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },

    // Form Container
    formContainer: {
        gap: 24,
    },

    // Input Section
    inputSection: {
        gap: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        paddingRight: 60,
        borderRadius: 12,
        fontSize: 16,
        color: '#111827',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    charCount: {
        position: 'absolute',
        right: 16,
        top: 16,
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // Selected Color Display
    selectedColorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedColorDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    selectedColorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },

    // Color Palette
    paletteScroll: {
        marginTop: 8,
    },
    paletteContent: {
        paddingVertical: 8,
    },
    colorWrapper: {
        marginHorizontal: 6,
    },
    colorOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    colorOptionSelected: {
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.1 }],
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    checkmark: {
        width: '100%',
        height: '100%',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },

    // Button Container
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingBottom: 80,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
});