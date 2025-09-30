import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WelcomeStyles as styles } from '../../styles/WelcomeStyles';
import { FontAwesome } from '@expo/vector-icons';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Mi Billetera</Text>
      <Text style={styles.subtitle}>Tu control financiero al alcance</Text>

      {/* Botón de Ingresar */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Iniciar Sesión')}
      >
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Botón de Registro */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.registerButtonText}>Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
};
