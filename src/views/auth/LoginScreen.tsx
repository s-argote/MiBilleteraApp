import React from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
    registerText: { textAlign: 'center', marginTop: 15, color: '#007AFF' },
});


export const LoginScreen = ({ navigation }: any) => {
    const { email, setEmail, password, setPassword, loading, error, handleLogin } = useAuthViewModel();

    React.useEffect(() => {
        if (error) {
            Alert.alert('Error de Autenticación', error);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button
                title={loading ? 'CARGANDO...' : 'ENTRAR'}
                onPress={handleLogin}
                disabled={loading}
                color="#007AFF"
            />

            <Text
                onPress={() => navigation.navigate('Register')}
                style={styles.registerText}
            >
                ¿No tienes cuenta? Regístrate
            </Text>
        </View>
    );
};