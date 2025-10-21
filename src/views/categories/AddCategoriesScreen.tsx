import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

const COLOR_PALETTE = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24'
];

export const AddCategoriesScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLOR_PALETTE[0]); // Color por defecto

    const { addCategory } = useCategoryViewModel();

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Nombre requerido', 'Por favor ingresa un nombre.');
            return;
        }

        try {
            await addCategory(name, color);
            Alert.alert('Éxito', 'Categoría guardada correctamente.');
            navigation.goBack();
        } catch (error: any) {
            // Muestra el mensaje de error al usuario
            Alert.alert('Error', error.message || 'No se pudo guardar la categoría.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Nueva Categoría</Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Alimentación, Transporte..."
                    value={name}
                    onChangeText={setName}
                    maxLength={30}
                />

                <Text style={styles.label}>Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paletteScroll}>
                    {COLOR_PALETTE.map((paletteColor) => (
                        <TouchableOpacity
                            key={paletteColor}
                            style={[
                                styles.colorOption,
                                { backgroundColor: paletteColor },
                                color === paletteColor && styles.colorOptionSelected,
                            ]}
                            onPress={() => setColor(paletteColor)}
                        />
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar Categoría</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        marginBottom: 20,
    },
    paletteScroll: {
        paddingVertical: 10,
        marginBottom: 20,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#007AFF',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});