import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface HomeScreenProps {
    handleLogout: () => Promise<void>;
    navigation: any;
}

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


export const HomeScreen: React.FC<HomeScreenProps> = ({ handleLogout }) => {
    return (
        <View style={styles.container}>
            <View style={styles.welcomeTextContainer}>
                {/* Ícono de casita */}
                <AntDesign name="home" size={24} color="black" style={{ marginRight: 10 }} />
                <Text style={styles.welcomeText}>Bienvenido a la app</Text>
            </View>

            <Button
                title="CERRAR SESIÓN"
                onPress={handleLogout}
                color="#007AFF"
            />
        </View>
    );
};