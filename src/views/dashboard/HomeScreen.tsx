import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    welcomeTextContainer: {
        fontSize: 20,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: 20
    }
});

export const HomeScreen: React.FC = () => {
    const { handleLogout } = useAuthViewModel(); // 

    return (
        <View style={styles.container}>
            <View style={styles.welcomeTextContainer}>
                <AntDesign name="home" size={24} color="black" style={{ marginRight: 10 }} />
                <Text style={styles.welcomeText}>Bienvenido a la app</Text>
            </View>
        </View>
    );
};