// src/views/account/ProfileScreen.tsx - VERSIÓN MEJORADA
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "../../context/AuthContext";
import { useProfileViewModel } from "../../viewmodels/ProfileViewModel";

export const ProfileScreen = ({ navigation }: any) => {
   const { profile } = useAuthContext();
   const { updateName, updateUserPassword, loading } = useProfileViewModel();

   const [name, setName] = useState(profile?.name || "");
   const [newPassword, setNewPassword] = useState("");
   const [currentPassword, setCurrentPassword] = useState("");

   const [showCurrent, setShowCurrent] = useState(false);
   const [showNew, setShowNew] = useState(false);

   const saveChanges = async () => {
      if (!name.trim()) {
         return Alert.alert("Error", "El nombre no puede estar vacío.");
      }

      try {
         await updateName(name);

         if (newPassword.trim().length > 0) {
            if (newPassword.length < 6) {
               return Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres.");
            }

            if (!currentPassword.trim()) {
               return Alert.alert("Error", "Debes ingresar tu contraseña actual para cambiarla.");
            }

            await updateUserPassword(newPassword, currentPassword);
         }

         Alert.alert("¡Éxito!", "Tus datos se actualizaron correctamente.", [
            { text: "OK", style: "default" }
         ]);
         setNewPassword("");
         setCurrentPassword("");

      } catch (error: any) {
         Alert.alert("Error", error.message || "No se pudo actualizar el perfil.");
      }
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
         >
            <ScrollView
               contentContainerStyle={styles.scrollContainer}
               showsVerticalScrollIndicator={false}
            >
               {/* Header con Avatar */}
               <LinearGradient
                  colors={['#1E40AF', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.headerGradient}
               >
                  <View style={styles.avatarContainer}>
                     <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>
                           {name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                        </Text>
                     </View>
                     <TouchableOpacity style={styles.editAvatarButton}>
                        <Ionicons name="camera" size={16} color="#FFFFFF" />
                     </TouchableOpacity>
                  </View>
                  <Text style={styles.headerTitle}>{name || "Usuario"}</Text>
                  <Text style={styles.headerEmail}>{profile?.email || ""}</Text>
               </LinearGradient>

               {/* Información Personal */}
               <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                     <Ionicons name="person-outline" size={20} color="#1E40AF" />
                     <Text style={styles.sectionTitle}>Información Personal</Text>
                  </View>

                  <View style={styles.card}>
                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre completo</Text>
                        <View style={styles.inputContainer}>
                           <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                           <TextInput
                              style={styles.input}
                              value={name}
                              onChangeText={setName}
                              placeholder="Tu nombre"
                              placeholderTextColor="#9CA3AF"
                           />
                        </View>
                     </View>

                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <View style={[styles.inputContainer, styles.disabledInput]}>
                           <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                           <Text style={styles.disabledText}>{profile?.email || ""}</Text>
                        </View>
                        <TouchableOpacity
                           onPress={() => navigation.navigate("Actualizar Correo")}
                           style={styles.changeEmailButton}
                        >
                           <Text style={styles.changeEmailText}>Cambiar correo</Text>
                           <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>

               {/* Seguridad */}
               <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                     <Ionicons name="shield-checkmark-outline" size={20} color="#1E40AF" />
                     <Text style={styles.sectionTitle}>Seguridad</Text>
                  </View>

                  <View style={styles.card}>
                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña actual</Text>
                        <View style={styles.inputContainer}>
                           <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                           <TextInput
                              style={styles.input}
                              secureTextEntry={!showCurrent}
                              value={currentPassword}
                              onChangeText={setCurrentPassword}
                              placeholder="Ingresa tu contraseña actual"
                              placeholderTextColor="#9CA3AF"
                           />
                           <TouchableOpacity
                              onPress={() => setShowCurrent(!showCurrent)}
                              style={styles.eyeButton}
                           >
                              <Ionicons
                                 name={showCurrent ? "eye-off-outline" : "eye-outline"}
                                 size={20}
                                 color="#6B7280"
                              />
                           </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>
                           Requerida solo si deseas cambiar tu contraseña
                        </Text>
                     </View>

                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nueva contraseña</Text>
                        <View style={styles.inputContainer}>
                           <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                           <TextInput
                              style={styles.input}
                              secureTextEntry={!showNew}
                              placeholder="Mínimo 6 caracteres"
                              placeholderTextColor="#9CA3AF"
                              value={newPassword}
                              onChangeText={setNewPassword}
                           />
                           <TouchableOpacity
                              onPress={() => setShowNew(!showNew)}
                              style={styles.eyeButton}
                           >
                              <Ionicons
                                 name={showNew ? "eye-off-outline" : "eye-outline"}
                                 size={20}
                                 color="#6B7280"
                              />
                           </TouchableOpacity>
                        </View>
                        {newPassword.length > 0 && newPassword.length < 6 && (
                           <View style={styles.warningContainer}>
                              <Ionicons name="warning-outline" size={14} color="#F59E0B" />
                              <Text style={styles.warningText}>
                                 La contraseña debe tener al menos 6 caracteres
                              </Text>
                           </View>
                        )}
                     </View>
                  </View>
               </View>

               {/* Botón Guardar */}
               <TouchableOpacity
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                  onPress={saveChanges}
                  disabled={loading}
                  activeOpacity={0.8}
               >
                  <LinearGradient
                     colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#1E40AF', '#3B82F6']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 0 }}
                     style={styles.saveButtonGradient}
                  >
                     {loading ? (
                        <View style={styles.loadingContainer}>
                           <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
                           <Text style={styles.saveButtonText}>Guardando...</Text>
                        </View>
                     ) : (
                        <View style={styles.loadingContainer}>
                           <Text style={styles.saveButtonText}>Guardar cambios</Text>
                        </View>
                     )}
                  </LinearGradient>
               </TouchableOpacity>

               {/* Info adicional */}
               <View style={styles.infoCard}>
                  <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
                  <Text style={styles.infoText}>
                     Tus datos están protegidos y encriptados. Solo tú tienes acceso a esta información.
                  </Text>
               </View>

            </ScrollView>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   container: {
      flex: 1,
   },
   scrollContainer: {
      paddingBottom: 30,
   },

   // Header
   headerGradient: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
   },
   avatarContainer: {
      position: 'relative',
      marginBottom: 16,
   },
   avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#FFFFFF',
   },
   avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#FFFFFF',
   },
   editAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#10B981',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
   },
   headerEmail: {
      fontSize: 14,
      color: '#E0E7FF',
   },

   // Sections
   section: {
      marginTop: 24,
      paddingHorizontal: 20,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
   },

   // Cards
   card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
   },

   // Inputs
   inputGroup: {
      marginBottom: 20,
   },
   label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: '#F9FAFB',
   },
   inputIcon: {
      marginRight: 8,
   },
   input: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 16,
      color: '#111827',
   },
   eyeButton: {
      padding: 8,
   },
   disabledInput: {
      backgroundColor: '#F3F4F6',
   },
   disabledText: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 16,
      color: '#6B7280',
   },
   helperText: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 6,
      marginLeft: 4,
   },

   // Change Email Button
   changeEmailButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      paddingVertical: 8,
   },
   changeEmailText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#007AFF',
      marginRight: 4,
   },

   // Warning
   warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
      paddingHorizontal: 4,
   },
   warningText: {
      fontSize: 12,
      color: '#F59E0B',
      flex: 1,
   },

   // Save Button
   saveButton: {
      marginHorizontal: 20,
      marginTop: 24,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
   },
   saveButtonDisabled: {
      shadowOpacity: 0.1,
   },
   saveButtonGradient: {
      paddingVertical: 16,
      paddingHorizontal: 24,
   },
   loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
   },
   saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
   },

   // Info Card
   infoCard: {
      marginHorizontal: 20,
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#EEF2FF',
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#3B82F6',
   },
   infoText: {
      flex: 1,
      fontSize: 13,
      color: '#1E40AF',
      lineHeight: 18,
   },
});