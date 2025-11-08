import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';

//  IMPORTA getAuth para obtener el userId
import { getAuth } from 'firebase/auth';

import { Transaction } from '../../models/Transaction';

const transactionTypes = ['Ingreso', 'Gasto'];

export const AddTransactionsScreen = ({ navigation }: any) => {
  const { addTransaction } = useTransactionViewModel();
  const { categories, loading: categoriesLoading } = useCategoryViewModel();

  const [type, setType] = useState<'Ingreso' | 'Gasto'>('Gasto');
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Inicializa la categoría con la primera disponible
  useEffect(() => {
    if (categories.length > 0 && !category) {
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
      //  Obtiene el userId
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No se pudo obtener el usuario. Por favor inicia sesión nuevamente.');
        return;
      }

      //  Crea el objeto con userId
      const newTransaction: Omit<Transaction, 'id'> = {
        title: title.trim(),
        amount: type === 'Gasto' ? -parsedAmount : parsedAmount,
        type,
        date: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0'),
        category,
        categoryId: categories.find(c => c.name === category)?.id || null,
        image: imageUri || '',
        userId: user.uid, //  Incluido
        color: categories.find(c => c.name === category)?.color || '#ccc',
      };

      await addTransaction(newTransaction);

      Alert.alert('Éxito', `${type} registrado con éxito.`);
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Registrar {type}</Text>

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
          placeholder="Ej: Pago de renta, Compra de café"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
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