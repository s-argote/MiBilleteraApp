import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={welcomeStyles.safeArea}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={welcomeStyles.container}
      >
        {/* Decorative circles */}
        <View style={welcomeStyles.circleTop} />
        <View style={welcomeStyles.circleBottom} />

        <Animated.View
          style={[
            welcomeStyles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Logo Container */}
          <View style={welcomeStyles.logoContainer}>
            <View style={welcomeStyles.logoBackground}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={welcomeStyles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title Section */}
          <View style={welcomeStyles.titleSection}>
            <Text style={welcomeStyles.title}>Mi Billetera</Text>
            <Text style={welcomeStyles.subtitle}>
              Tu control financiero al alcance de tus manos
            </Text>
          </View>

          {/* Features */}
          <View style={welcomeStyles.features}>
            {[
              { icon: 'wallet', text: 'Gestiona tus gastos' },
              { icon: 'trending-up', text: 'Analiza tus finanzas' },
            ].map((feature, index) => (
              <View key={index} style={welcomeStyles.featureItem}>
                <View style={welcomeStyles.featureIconContainer}>
                  <Ionicons name={feature.icon as any} size={20} color="#3B82F6" />
                </View>
                <Text style={welcomeStyles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View style={welcomeStyles.buttonsContainer}>
            <TouchableOpacity
              style={welcomeStyles.loginButton}
              onPress={() => navigation.navigate('Iniciar Sesión')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F3F4F6']}
                style={welcomeStyles.loginGradient}
              >
                <Ionicons name="log-in" size={22} color="#1E40AF" />
                <Text style={welcomeStyles.loginButtonText}>Iniciar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={welcomeStyles.registerButton}
              onPress={() => navigation.navigate('Registro')}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <Text style={welcomeStyles.registerButtonText}>Crear Cuenta Nueva</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={welcomeStyles.footer}>
            Al continuar, aceptas nuestros términos y condiciones
          </Text>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const welcomeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E40AF',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  circleTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    marginBottom: 48,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 14,
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});