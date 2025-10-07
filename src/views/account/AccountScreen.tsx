import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';

export const AccountScreen = () => {
    const { handleLogout } = useAuthViewModel();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Cuenta</Text>
            <Button title="Cerrar Sesión" onPress={handleLogout} color="#FF3B30" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
    text: { fontSize: 20, fontWeight: 'bold' }
});