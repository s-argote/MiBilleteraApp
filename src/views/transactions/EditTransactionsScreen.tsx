import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';
import { Transaction } from '../../models/Transaction';

export const EditTransactionsScreen = ({ route, navigation }: any) => {
  const { transaction } = route.params;
  const { updateTransaction } = useTransactionViewModel();
  const { categories, loading: categoriesLoading } = useCategoryViewModel();

  const initialAmount = Math.abs(transaction.amount).toString();
  const [type, setType] = useState<'Ingreso' | 'Gasto'>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(initialAmount);
  const [date, setDate] = useState(new Date(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(transaction.image || null);

  const selectedCategoryObj = categories.find((c) => c.name === category);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleImageAttach = () => {
    Alert.alert(
      'Adjuntar imagen',
      'Funcionalidad de cámara/galería próximamente',
      [{ text: 'OK' }]
    );
  };

  const handleSave = async () => {
    const cleanAmount = amount.replace(',', '.');
    const parsedAmount = parseFloat(cleanAmount);

    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título.');
      return;
    }
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un monto válido mayor a 0.');
      return;
    }

    try {
      await updateTransaction(transaction.id, {
        title: title.trim(),
        amount: type === 'Gasto' ? -parsedAmount : parsedAmount,
        type,
        date: date.toISOString().split('T')[0],
        category,
        categoryId: categories.find((c) => c.name === category)?.id || null,
        image: imageUri || '',
        color: selectedCategoryObj?.color || '#9CA3AF',
      } as Transaction);

      Alert.alert('Éxito', 'Transacción actualizada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar la transacción.');
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.safeArea}>
      {/* Header */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Transacción</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de transacción</Text>
          <View style={styles.typeSelector}>
            {['Ingreso', 'Gasto'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                onPress={() => setType(t as 'Ingreso' | 'Gasto')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    type === t
                      ? t === 'Ingreso'
                        ? ['#10B981', '#059669']
                        : ['#EF4444', '#DC2626']
                      : ['#F3F4F6', '#F3F4F6']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.typeButtonGradient}
                >
                  <Ionicons
                    name={t === 'Ingreso' ? 'arrow-down-circle' : 'arrow-up-circle'}
                    size={24}
                    color={type === t ? '#FFFFFF' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === t && styles.typeButtonTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.label}>Título</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="text-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Ej: Pago luz, Compra café"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>
        </View>

        {/* Monto */}
        <View style={styles.section}>
          <Text style={styles.label}>Monto</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Categoría */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoría</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryModal(true)}
          >
            {selectedCategoryObj && (
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: selectedCategoryObj.color || '#9CA3AF' },
                ]}
              />
            )}
            <Text style={styles.categoryButtonText}>
              {selectedCategoryObj?.icon || '📁'} {category || 'Seleccionar'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#1E40AF" />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Comprobante */}
        <View style={styles.section}>
          <Text style={styles.label}>Comprobante (opcional)</Text>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImageAttach}
          >
            <Ionicons name="camera" size={20} color="#3B82F6" />
            <Text style={styles.imageButtonText}>
              {imageUri ? 'Imagen adjunta' : 'Adjuntar imagen'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón guardar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Categorías */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>Seleccionar categoría</Text>
            </View>

            <ScrollView style={styles.categoriesList}>
              {categoriesLoading ? (
                <Text style={styles.loadingText}>Cargando categorías...</Text>
              ) : (
                categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      category === cat.name && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      setCategory(cat.name);
                      setShowCategoryModal(false);
                    }}
                  >
                    <View style={styles.categoryItemLeft}>
                      <View
                        style={[
                          styles.categoryItemDot,
                          { backgroundColor: cat.color || '#9CA3AF' },
                        ]}
                      />
                      <Text style={styles.categoryItemText}>
                        {cat.icon || '📁'} {cat.name}
                      </Text>
                    </View>
                    {category === cat.name && (
                      <Ionicons name="checkmark" size={24} color="#1E40AF" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  // Type Selector
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  typeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  amountPreview: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'right',
    marginTop: 8,
  },

  // Category Button
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  // Date Button
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    textTransform: 'capitalize',
  },

  // Image Button
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    gap: 12,
  },
  imageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Save Button
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
    fontSize: 18,
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
    maxHeight: '70%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  categoriesList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryItemDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryItemText: {
    fontSize: 16,
    color: '#111827',
  },
  loadingText: {
    textAlign: 'center',
    padding: 24,
    color: '#6B7280',
  },
});