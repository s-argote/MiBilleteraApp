import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { WelcomeScreen } from './src/views/auth/WelcomeScreen';
import { LoginScreen } from './src/views/auth/LoginScreen';
import { RegisterScreen } from './src/views/auth/RegisterScreen';
import { MainTabNavigator } from './src/navigation/MainTabNavigator';
import { VerifyEmailScreen } from './src/views/auth/VerifyEmailScree';
import { AuthService } from './src/services/AuthService';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const App = () => {
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {

      if (firebaseUser) {
        //  Necesario para actualizar emailVerified
        await firebaseUser.reload();

        if (firebaseUser.emailVerified) {
          setUser({ uid: firebaseUser.uid });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabNavigator />
      ) : (
        // Stack para flujo de autenticación
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

// Stack interno para login/register
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

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

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default App;