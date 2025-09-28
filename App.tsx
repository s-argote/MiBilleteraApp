import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User } from 'firebase/auth';

// --- Importaciones de tu estructura MVVM ---
import { AuthService } from './src/services/AuthService';
import { useAuthViewModel } from './src/viewmodels/AuthViewModel';
import { LoginScreen } from './src/views/auth/LoginScreen';
import { RegisterScreen } from './src/views/auth/RegisterScreen'; // Importado
import { HomeScreen } from './src/views/dashboard/HomeScreen';
import { WelcomeScreen } from './src/views/auth/WelcomeScreen';

const Stack = createNativeStackNavigator();

// Stack de navegación para usuarios NO autenticados (Login y Registro)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Stack de navegación para usuarios AUTENTICADOS (Home/Dashboard)
function AppStack({ handleLogout }: { handleLogout: () => Promise<void> }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ title: 'Mi Billetera App' }}>
        {/* Pasa handleLogout a la HomeScreen */}
        {props => <HomeScreen {...props} handleLogout={handleLogout} />}
      </Stack.Screen>
      {/* Aquí irían las otras pantallas: Categories, Transactions, etc. */}
    </Stack.Navigator>
  );
}

// Componente principal de la aplicación
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Instancia el View Model para obtener handleLogout (Regla de Hooks)
  const { handleLogout } = useAuthViewModel();

  // Observador de Firebase Auth
  useEffect(() => {
    // onAuthStateChanged se dispara cuando el usuario inicia, cierra o se registra
    const subscriber = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Deja de escuchar al desmontar
    return subscriber;
  }, []);

  if (initializing) {
    // Retorna nulo o un componente de carga mientras Firebase verifica la sesión
    return null;
  }

  return (
    <NavigationContainer>
      {/* Renderizado condicional */}
      {user ? (
        <AppStack handleLogout={handleLogout} /> // Si hay usuario, Stack Principal
      ) : (
        <AuthStack /> // Si no hay usuario, Stack de Autenticación
      )}
    </NavigationContainer>
  );
}