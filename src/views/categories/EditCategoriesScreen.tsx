import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';

export const EditCategoriesScreen = ({ route, navigation }: any) => {
    const { category } = route.params; // Recibimos la categoría desde la navegación

    const [name, setName] = useState(category.name);
    const [color, setColor] = useState(category.color);

    useEffect(() => {
        navigation.setOptions({ title: 'Editar Categoría' });
    }, [navigation]);

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Nombre requerido', 'Por favor ingresa un nombre.');
            return;
        }

        // Aquí iría la actualización en Firebase (más adelante)
        Alert.alert('Éxito', 'Categoría actualizada (solo visual por ahora)');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Editar Categoría</Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    maxLength={30}
                />

                <Text style={styles.label}>Color</Text>
                <View style={styles.colorPreview}>
                    <View style={[styles.colorBox, { backgroundColor: color }]} />
                    <Text style={styles.colorText}>{color}</Text>
                </View>

                <Text style={styles.hint}>El selector de color se agregará más adelante.</Text>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
    colorPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    colorBox: {
        width: 32,
        height: 32,
        borderRadius: 6,
        marginRight: 12,
    },
    colorText: {
        fontSize: 14,
        color: '#666',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginBottom: 24,
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