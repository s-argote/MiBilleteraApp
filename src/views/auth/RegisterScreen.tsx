import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 24, textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5 },
    loginText: { textAlign: 'center', marginTop: 15, color: '#007AFF' },
});

export const RegisterScreen = ({ navigation }: any) => {
    const { email, setEmail, password, setPassword, loading, error, handleRegister } = useAuthViewModel();

    React.useEffect(() => {
        if (error) {
            Alert.alert('Error de Registro', error);
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Nueva Cuenta</Text>

            <TextInput
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <Button
                title={loading ? 'CREANDO CUENTA...' : 'REGISTRARSE'}
                onPress={handleRegister}
                disabled={loading}
                color="#007AFF"
            />

            <Text
                onPress={() => navigation.navigate('Login')}
                style={styles.loginText}
            >
                ¿Ya tienes cuenta? Inicia Sesión
            </Text>
        </View>
    );
};