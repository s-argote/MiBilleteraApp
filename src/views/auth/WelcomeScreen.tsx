import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <FontAwesome name="shield" size={60} color="#4A4AFF" style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Mi Billetera</Text>
      <Text style={styles.subtitle}>Tu control financiero al alcance</Text>

      {/* Botón de Ingresar */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Botón de Registro */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerButtonText}>Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C54',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6D6D6D',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4A4AFF',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderColor: '#4A4AFF',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#4A4AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
