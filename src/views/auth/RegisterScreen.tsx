import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';

export const RegisterScreen = ({ navigation }: any) => {
  const { name, setName, email, setEmail, password, setPassword, loading, error, handleRegister } = useAuthViewModel();
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onPressRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await handleRegister();
      Alert.alert(
        'Cuenta creada',
        'Te enviamos un correo para verificar tu cuenta antes de iniciar sesión.'
      );
      navigation.navigate('Verificar Email');
    } catch (err: any) {
      Alert.alert('Error de Registro', error || 'No se pudo registrar.');
    }
  };

  const getPasswordStrength = () => {
    const length = password.length;
    if (length === 0) return { text: '', color: '#E5E7EB', width: 0 };
    if (length < 6) return { text: 'Débil', color: '#EF4444', width: 33 };
    if (length < 10) return { text: 'Media', color: '#F59E0B', width: 66 };
    return { text: 'Fuerte', color: '#10B981', width: 100 };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={registerStyles.safeArea}>
      <TouchableOpacity
        style={registerStyles.backButton}
        onPress={() => navigation.goBack("Bienvenida")}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={registerStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={registerStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={registerStyles.logoSection}>
            <View style={registerStyles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={registerStyles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={registerStyles.welcomeTitle}>¡Bienvenido!</Text>
            <Text style={registerStyles.welcomeSubtitle}>
              Crea tu cuenta y comienza a gestionar tus finanzas
            </Text>
          </View>

          {/* Form Card */}
          <View style={registerStyles.formCard}>
            {/* Name Input */}
            <View style={registerStyles.inputSection}>
              <Text style={registerStyles.inputLabel}>Nombre Completo</Text>
              <View style={[
                registerStyles.inputContainer,
                nameFocused && registerStyles.inputContainerFocused
              ]}>
                <Ionicons
                  name="person"
                  size={20}
                  color={nameFocused ? "#3B82F6" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="Juan Pérez"
                  value={name}
                  onChangeText={setName}
                  style={registerStyles.input}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={registerStyles.inputSection}>
              <Text style={registerStyles.inputLabel}>Correo Electrónico</Text>
              <View style={[
                registerStyles.inputContainer,
                emailFocused && registerStyles.inputContainerFocused
              ]}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={emailFocused ? "#3B82F6" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={registerStyles.input}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={registerStyles.inputSection}>
              <Text style={registerStyles.inputLabel}>Contraseña</Text>
              <View style={[
                registerStyles.inputContainer,
                passwordFocused && registerStyles.inputContainerFocused
              ]}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={passwordFocused ? "#3B82F6" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={registerStyles.input}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={registerStyles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength */}
              {password.length > 0 && (
                <View style={registerStyles.strengthContainer}>
                  <View style={registerStyles.strengthBar}>
                    <View
                      style={[
                        registerStyles.strengthFill,
                        {
                          width: `${passwordStrength.width}%`,
                          backgroundColor: passwordStrength.color
                        }
                      ]}
                    />
                  </View>
                  <Text style={[registerStyles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Error Message */}
            {!!error && (
              <View style={registerStyles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text style={registerStyles.errorText}>{error}</Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={registerStyles.registerButton}
              onPress={onPressRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={registerStyles.registerGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="person-add" size={22} color="#FFFFFF" />
                    <Text style={registerStyles.registerButtonText}>Crear Cuenta</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={registerStyles.divider}>
              <View style={registerStyles.dividerLine} />
              <Text style={registerStyles.dividerText}>o</Text>
              <View style={registerStyles.dividerLine} />
            </View>

            {/* Links */}
            <View style={registerStyles.linksContainer}>
              <View style={registerStyles.linkRow}>
                <Text style={registerStyles.linkText}>¿Ya te registraste? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Verificar Email")}>
                  <Text style={registerStyles.link}>Verificar correo</Text>
                </TouchableOpacity>
              </View>
              <View style={registerStyles.linkRow}>
                <Text style={registerStyles.linkText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Iniciar Sesión")}>
                  <Text style={registerStyles.link}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const registerStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientHeader: {
    paddingHorizontal: 20,
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
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 20,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  inputContainerFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    padding: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  registerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  linksContainer: {
    gap: 12,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 15,
    color: '#6B7280',
  },
  link: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '700',
  },
});