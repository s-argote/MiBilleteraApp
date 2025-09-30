import React from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { LoginStyles as styles } from '../../styles/LoginStyles';

// Componente de Pantalla de Login
export const LoginScreen = ({ navigation }: any) => {
  const { email, setEmail, password, setPassword, loading, error, setError, handleLogin } = useAuthViewModel();

  const [showPassword, setShowPassword] = React.useState(false); // controla visibilidad de la contraseña


  // Limpia errores al cambiar input
  React.useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  const onLoginPress = async () => {
    // Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      await handleLogin();
    } catch (err) {
      setError('Credenciales incorrectas o usuario no registrado.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />

        <View style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { color: '#000' }]}
            placeholderTextColor="#999"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              placeholderTextColor="#999"
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={{ fontSize: 16 }}>
                {showPassword ? '🙈' : '👁'}
              </Text>
            </TouchableOpacity>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={onLoginPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.registerText}>
            ¿No tienes cuenta?{' '}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Registro')}
            >
              Regístrate
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};