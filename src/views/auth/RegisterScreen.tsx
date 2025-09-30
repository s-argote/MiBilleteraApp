import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { RegisterStyles as styles } from '../../styles/RegisterStyles';

export const RegisterScreen = ({ navigation }: any) => {
  const { name, setName, email, setEmail, password, setPassword, loading, error, setError, handleRegister } = useAuthViewModel();

  const [showPassword, setShowPassword] = React.useState(false); // controla visibilidad de la contraseña

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error de Registro', error);
    }
  }, [error]);

  const onPressRegister = () => {
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    handleRegister()
      .then(() => {
        Alert.alert('¡Cuenta creada!', 'Ahora puedes iniciar sesión.');
        navigation.navigate('Home');
      })
      .catch(() => {
        // El error ya se maneja en el ViewModel
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />

        <View style={styles.card}>
          <Text style={styles.title}>Crear Nueva Cuenta</Text>

          <TextInput
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: '#000' }]}
            placeholderTextColor="#999"
          />

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
              placeholder="Contraseña (mín. 6 caracteres)"
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
            onPress={onPressRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarme</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginText}>
            ¿Ya tienes cuenta?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Iniciar Sesión')}>
              Inicia sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  );
};