import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

const transactionTypes = ['Ingreso', 'Gasto'];

export const EditTransactionsScreen = ({ route, navigation }: any) => {
  const { transaction } = route.params;
  const { updateTransaction } = useTransactionViewModel();
  const { categories, loading: categoriesLoading } = useCategoryViewModel();

  const initialAmount = Math.abs(transaction.amount).toFixed(0);
  // Convierte la cadena "YYYY-MM-DD" a un objeto Date de forma segura
  const dateParts = transaction.date.split('-').map(Number);
  const initialDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

  const [type, setType] = useState<'Ingreso' | 'Gasto'>(transaction.type);
  const [category, setCategory] = useState<string>(transaction.category);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(initialAmount);
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(transaction.image || null);

  useEffect(() => {
    navigation.setOptions({ title: 'Editar Transacción' });
  }, [navigation]);

  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.name === category)) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleImageAttach = () => {
    Alert.alert('Funcionalidad Pendiente', 'La selección de imagen se implementará más adelante.');
    setImageUri('https://via.placeholder.com/50/4ECDC4/FFFFFF?text=IMG');
  };

  const handleSave = async () => {
    const cleanAmount = amount.replace(',', '.');
    const parsedAmount = parseFloat(cleanAmount);

    if (!title.trim()) {
      Alert.alert('Título requerido', 'Por favor ingresa un título.');
      return;
    }
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        title: title.trim(),
        amount: type === 'Gasto' ? -parsedAmount : parsedAmount,
        type,
        date: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'),
        category,
        image: imageUri || '',
        color: categories.find(c => c.name === category)?.color || '#ccc',
      });
      Alert.alert('Éxito', `La transacción "${title}" ha sido actualizada.`);
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      Alert.alert('Error', 'No se pudo actualizar la transacción. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Transacción</Text>

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={styles.picker}
          >
            {transactionTypes.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          {categoriesLoading ? (
            <Text>Cargando categorías...</Text>
          ) : (
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              {categories.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.name} />
              ))}
              <Picker.Item label="Otros" value="Otros" />
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Título / Descripción</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Recibo o Comprobante (Opcional)</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleImageAttach}>
          <MaterialIcons name="attach-file" size={20} color="#fff" />
          <Text style={styles.imageButtonText}>
            {imageUri ? 'Recibo Adjunto' : 'Adjuntar Imagen'}
          </Text>
        </TouchableOpacity>
        {imageUri && <Text style={styles.hint}>Estado actual: Recibo adjunto.</Text>}

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