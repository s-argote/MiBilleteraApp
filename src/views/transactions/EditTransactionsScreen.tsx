import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionViewModel } from '../../viewmodels/TransactionViewModel';
import { useCategoryViewModel } from '../../viewmodels/CategoryViewModel';
import * as ImagePicker from "expo-image-picker";
import { Transaction } from '../../models/Transaction';

export const EditTransactionsScreen = ({ navigation, route }: any) => {

  const { updateTransaction, uploadImage, deleteImageFromStorage } = useTransactionViewModel();
  const { categories } = useCategoryViewModel();

  const transaction: Transaction = route.params.transaction;

  const [type, setType] = useState<'Ingreso' | 'Gasto'>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const parseLocalDate = (str: string) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const [date, setDate] = useState(parseLocalDate(transaction.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(transaction.image || null);
  const [newImageUri, setNewImageUri] = useState<string | null>(null); // nueva imagen a subir
  const [saving, setSaving] = useState(false);


  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  /* =============================
      MANEJO DE IMAGEN
  ============================== */

  const handleImageAttach = () => {
    Alert.alert(
      "Cambiar imagen",
      "¿De dónde deseas obtener la nueva imagen?",
      [
        { text: "Cámara", onPress: pickFromCamera },
        { text: "Galería", onPress: pickFromGallery },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const handleDeleteImage = () => {
    Alert.alert(
      "Eliminar imagen",
      "¿Seguro que deseas quitar la imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (imageUri) {
              await deleteImageFromStorage(imageUri);
            }
            setImageUri(null);
            setNewImageUri(null);
          }
        }
      ]
    );
  };

  /* =============================
      GUARDAR CAMBIOS
  ============================== */

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    const cleanAmount = amount.replace(',', '.');
    const parsedAmount = parseFloat(cleanAmount);

    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un título.');
      setSaving(false);
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un monto válido mayor a 0.');
      setSaving(false);
      return;
    }

    try {
      let finalImageUrl = imageUri;

      if (newImageUri) {
        if (imageUri) await deleteImageFromStorage(imageUri);
        finalImageUrl = await uploadImage(newImageUri);
      }

      const updated: Partial<Transaction> = {
        title: title.trim(),
        amount: type === 'Gasto' ? -parsedAmount : parsedAmount,
        type,
        date: formatLocalDate(date),
        category,
        categoryId: categories.find((c) => c.name === category)?.id || null,
        image: finalImageUrl,
        color: categories.find((c) => c.name === category)?.color || '#9CA3AF',
      };

      await updateTransaction(transaction.id, updated);

      Alert.alert("¡Actualizado!", "La transacción se modificó correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);

    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la transacción.");
    }

    setSaving(false);
  };


  const selectedCategoryObj = categories.find((c) => c.name === category);

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
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

        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Tipo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de transacción</Text>

          <View style={styles.typeSelector}>
            {['Ingreso', 'Gasto'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeButton, type === t && styles.typeButtonActive]}
                onPress={() => setType(t as 'Ingreso' | 'Gasto')}
              >
                <LinearGradient
                  colors={
                    type === t
                      ? (t === 'Ingreso'
                        ? ['#10B981', '#059669']
                        : ['#EF4444', '#DC2626'])
                      : ['#F3F4F6', '#F3F4F6']
                  }
                  style={styles.typeButtonGradient}
                >
                  <Ionicons
                    name={t === 'Ingreso' ? 'arrow-down-circle' : 'arrow-up-circle'}
                    size={24}
                    color={type === t ? '#FFFFFF' : '#6B7280'}
                  />

                  <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
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
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Compra de café"
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
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Categoría */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoría</Text>

          <TouchableOpacity style={styles.categoryButton} onPress={() => setShowCategoryModal(true)}>
            {selectedCategoryObj && (
              <View style={[styles.categoryDot, { backgroundColor: selectedCategoryObj.color }]} />
            )}

            <Text style={styles.categoryButtonText}>
              {selectedCategoryObj?.icon} {category}
            </Text>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha</Text>

          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color="#1E40AF" />

            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('es-ES', {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DATE PICKER */}
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}

        {/* IMAGEN */}
        <View style={styles.section}>
          <Text style={styles.label}>Comprobante</Text>

          <TouchableOpacity style={styles.imageButton} onPress={handleImageAttach}>
            <Ionicons name="camera" size={20} color="#3B82F6" />
            <Text style={styles.imageButtonText}>
              {newImageUri ? "Nueva imagen lista" : imageUri ? "Cambiar imagen" : "Adjuntar imagen"}
            </Text>
          </TouchableOpacity>

          {(newImageUri || imageUri) && (
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Image
                source={{ uri: newImageUri || imageUri! }}
                style={{ width: 170, height: 170, borderRadius: 16 }}
              />

              <TouchableOpacity onPress={handleDeleteImage}>
                <Text style={{ marginTop: 8, color: "#DC2626", fontWeight: "600" }}>
                  Quitar imagen
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* GUARDAR */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && { opacity: 0.6 }
          ]}
          onPress={handleSave}
          activeOpacity={saving ? 1 : 0.7}
          disabled={saving}
        >
          <LinearGradient
            colors={saving ? ['#9CA3AF', '#6B7280'] : ['#1E40AF', '#3B82F6']}
            style={styles.saveButtonGradient}
          >
            {saving ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="hourglass-outline" size={20} color="#FFF" />
                <Text style={styles.saveButtonText}>Guardando...</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>


      </ScrollView>

      {/* MODAL CATEGORÍAS */}
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
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    category === cat.name && styles.categoryItemSelected
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={styles.categoryItemLeft}>
                    <View
                      style={[styles.categoryItemDot, { backgroundColor: cat.color }]}
                    />
                    <Text style={styles.categoryItemText}>{cat.icon} {cat.name}</Text>
                  </View>

                  {category === cat.name && (
                    <Ionicons name="checkmark" size={24} color="#1E40AF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};


/* ======================= ESTILOS ======================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50
  },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },

  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },

  /* TYPE BUTTONS */
  typeSelector: { flexDirection: 'row', gap: 12 },
  typeButton: { flex: 1, borderRadius: 12, overflow: "hidden" },
  typeButtonActive: {},
  typeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8
  },
  typeButtonText: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
  typeButtonTextActive: { color: '#FFF' },

  /* INPUTS */
  inputContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: { flex: 1, paddingVertical: 14, marginLeft: 12, fontSize: 16 },
  currencySymbol: { fontSize: 20, fontWeight: 'bold', color: '#1E40AF' },

  /* CATEGORY */
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  categoryButtonText: { flex: 1, fontSize: 16 },

  /* DATE */
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    gap: 12
  },
  dateButtonText: { fontSize: 16, color: '#111827', textTransform: "capitalize" },

  /* IMAGE */
  imageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FFF',
    gap: 12
  },
  imageButtonText: { fontSize: 16, fontWeight: '600', color: '#3B82F6' },

  /* SAVE BUTTON */
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden'
  },
  saveButtonGradient: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  /* MODAL */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FFF',
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
  modalTitle: { fontSize: 18, fontWeight: 'bold' },

  categoriesList: { maxHeight: 300 },
  categoryItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  categoryItemSelected: { backgroundColor: '#EEF2FF' },
  categoryItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryItemDot: { width: 12, height: 12, borderRadius: 6 },
  categoryItemText: { fontSize: 16 }

});

