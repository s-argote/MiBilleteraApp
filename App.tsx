import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuthContext } from './src/context/AuthContext';

import { WelcomeScreen } from './src/views/auth/WelcomeScreen';
import { LoginScreen } from './src/views/auth/LoginScreen';
import { RegisterScreen } from './src/views/auth/RegisterScreen';
import { VerifyEmailScreen } from './src/views/auth/VerifyEmailScreen';
import { MainTabNavigator } from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator();

/** 
 * Este componente decide si mostrar:
 *  MainTabNavigator (usuario autenticado)
 *  AuthStack (login / registro / verificar email)
 */
const RootNavigator = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null; // ya no necesitas loader aquí
  }

  // Usuario autenticado → va a la app
  if (user && user.emailVerified) {
    return <MainTabNavigator />;
  }

  // Usuario no autenticado → flujo de login
  return <AuthStack />;
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bienvenida" component={WelcomeScreen} />
      <Stack.Screen name="Iniciar Sesión" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegisterScreen} />
      <Stack.Screen name="Verificar Email" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
