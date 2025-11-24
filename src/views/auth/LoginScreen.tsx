import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthViewModel } from "../../viewmodels/AuthViewModel";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from 'react-native';
import { WelcomeScreen } from "./WelcomeScreen";

export const LoginScreen = () => {
  const {
    email, setEmail,
    password, setPassword,
    loading, error, setError,
    handleLogin,
    handlePasswordReset
  } = useAuthViewModel();

  const { refreshUser } = useAuthContext();
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);

  const onLoginPress = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      const loggedUser = await handleLogin();
      await refreshUser();

      if (!loggedUser.emailVerified) {
        Alert.alert("Correo no verificado", "Por favor verifica tu correo antes de continuar.");
        return;
      }
    } catch (err: any) {
      Alert.alert("Error de Inicio de Sesión", error || "Credenciales inválidas.");
    }
  };

  return (
    <SafeAreaView style={loginStyles.safeArea}>
      <TouchableOpacity
        style={loginStyles.backButton}
        onPress={() => navigation.goBack(WelcomeScreen)}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />

      </TouchableOpacity>

      <KeyboardAvoidingView
        style={loginStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={loginStyles.logoSection}>
            <View style={loginStyles.logoContainer}>
              <Image
                source={require("../../../assets/images/logo.png")}
                style={loginStyles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={loginStyles.welcomeTitle}>Iniciar Sesión</Text>
            <Text style={loginStyles.welcomeSubtitle}>
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          {/* Form Card */}
          <View style={loginStyles.formCard}>
            {/* Email Input */}
            <View style={loginStyles.inputSection}>
              <Text style={loginStyles.inputLabel}>Correo Electrónico</Text>
              <View style={[
                loginStyles.inputContainer,
                emailFocused && loginStyles.inputContainerFocused
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
                  style={loginStyles.input}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={loginStyles.inputSection}>
              <Text style={loginStyles.inputLabel}>Contraseña</Text>
              <View style={[
                loginStyles.inputContainer,
                passwordFocused && loginStyles.inputContainerFocused
              ]}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={passwordFocused ? "#3B82F6" : "#9CA3AF"}
                />
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={loginStyles.input}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={loginStyles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("RecuperarContraseña")}
              style={loginStyles.forgotButton}
            >
              <Text style={loginStyles.forgotText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Error Message */}
            {!!error && (
              <View style={loginStyles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text style={loginStyles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={loginStyles.loginButton}
              onPress={onLoginPress}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={loginStyles.loginGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="log-in" size={22} color="#FFFFFF" />
                    <Text style={loginStyles.loginButtonText}>Iniciar Sesión</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={loginStyles.registerContainer}>
              <Text style={loginStyles.registerText}>
                ¿No tienes cuenta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                <Text style={loginStyles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const loginStyles = StyleSheet.create({
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: '#3B82F6',
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
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 15,
    color: '#6B7280',
  },
  registerLink: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
});