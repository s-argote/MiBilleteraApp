import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Se asume que esta librería está instalada
import { Picker } from '@react-native-picker/picker'; // Se asume que esta librería está instalada
import { MaterialIcons } from '@expo/vector-icons';

// Mocks para los selectores
const transactionTypes = ['Ingreso', 'Gasto'];
const mockCategories = [
    { id: '1', name: 'Alimentación' },
    { id: '2', name: 'Transporte' },
    { id: '3', name: 'Entretenimiento' },
    { id: '4', name: 'Salud' },
    { id: '5', name: 'Ropa' },
    { id: '6', name: 'Otros' },
];

export const AddTransactionsScreen = ({ navigation }: any) => {
    const [type, setType] = useState('Gasto'); // Por defecto 'Gasto'
    const [category, setCategory] = useState(mockCategories[0].name);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null); // Campo opcional

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    // Lógica para adjuntar imagen (simulada por ahora)
    const handleImageAttach = () => {
        Alert.alert('Funcionalidad Pendiente', 'La selección de imagen se implementará más adelante.');
        // Aquí iría la lógica para abrir la galería o cámara
        setImageUri('simulated-uri');
    };

    // RF11: Acción del botón "Guardar"
    const handleSave = () => {
        const parsedAmount = parseFloat(amount.replace(',', '.'));

        if (!title.trim() || !amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert('Campos requeridos', 'Por favor, completa el título y un monto válido.');
            return;
        }

        const newTransaction = {
            id: Date.now().toString(), // Generar un ID simple
            title: title.trim(),
            amount: type === 'Gasto' ? -parsedAmount : parsedAmount,
            type,
            date: date.toISOString().split('T')[0],
            category,
            image: imageUri || '',
        };

        // Aquí iría la lógica de guardar en la base de datos (más adelante)
        console.log('Transacción a guardar:', newTransaction);

        Alert.alert('Éxito', `${type} registrado con éxito.`);
        navigation.goBack(); // Regresa a la lista
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Registrar {type}</Text>

                {/* Tipo de Transacción (Ingreso/Gasto) */}
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {transactionTypes.map((t) => (
                            <Picker.Item key={t} label={t} value={t} />
                        ))}
                    </Picker>
                </View>

                {/* Categoría */}
                <Text style={styles.label}>Categoría</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        {mockCategories.map((c) => (
                            <Picker.Item key={c.id} label={c.name} value={c.name} />
                        ))}
                    </Picker>
                </View>


                {/* Título */}
                <Text style={styles.label}>Título / Descripción</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Pago de renta, Compra de café"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={50}
                />

                {/* Monto */}
                <Text style={styles.label}>Monto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                {/* Fecha */}
                <Text style={styles.label}>Fecha</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
                    <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* Archivo Imagen (Opcional) */}
                <Text style={styles.label}>Recibo o Comprobante (Opcional)</Text>
                <TouchableOpacity style={styles.imageButton} onPress={handleImageAttach}>
                    <MaterialIcons name="attach-file" size={20} color="#fff" />
                    <Text style={styles.imageButtonText}>
                        {imageUri ? 'Recibo Adjunto' : 'Adjuntar Imagen'}
                    </Text>
                </TouchableOpacity>
                {imageUri && <Text style={styles.hint}>Imagen simulada adjunta.</Text>}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar {type}</Text>
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
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    imageButton: {
        flexDirection: 'row',
        backgroundColor: '#5AC8FA',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});