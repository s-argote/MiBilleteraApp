import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';

export const AccountScreen = ({ navigation }: any) => {
    const { logout, profile, user } = useAuthContext();
    const scaleAnim = new Animated.Value(1);

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true })
        ]).start();
    };

    const handleLogoutPress = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(profile?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.profileName}>
                    {profile?.name || "Usuario"}
                </Text>
                <Text style={styles.profileEmail}>
                    {user?.email}
                </Text>
            </View>

            {/* OPCIONES */}
            <View style={styles.buttonsContainer}>
                {[
                    { label: "Mi Cuenta", icon: "person", route: "Perfil" },
                    { label: "Alertas y Metas", icon: "notifications", route: "Alertas y Metas" },
                    { label: "Historial", icon: "history-toggle-off", route: "Historial" },
                ].map((item, index) => (
                    <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }], width: "100%" }}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                animatePress();
                                navigation.navigate(item.route);
                            }}
                        >
                            <MaterialIcons name={item.icon as any} size={26} color="#007AFF" />
                            <Text style={styles.optionText}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={26} color="#A1A1A1" style={{ marginLeft: "auto" }} />
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                {/* CERRAR SESIÓN */}
                <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogoutPress}>
                    <MaterialIcons name="logout" size={26} color="#FF3B30" />
                    <Text style={[styles.optionText, styles.logoutText]}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>MiBilleteraApp • versión 1.0.0</Text>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    profileContainer: { alignItems: 'center', paddingVertical: 30 },
    avatar: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: '#007AFF22',
        justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { fontSize: 36, color: '#007AFF', fontWeight: '700' },
    profileName: { marginTop: 10, fontSize: 20, fontWeight: '700', color: '#333' },
    profileEmail: { fontSize: 14, color: '#666' },
    buttonsContainer: { marginTop: 20, paddingHorizontal: 20, gap: 10 },
    optionButton: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16, borderRadius: 12,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3,
    },
    optionText: { fontSize: 16, marginLeft: 15, color: '#333' },
    logoutButton: { marginTop: 20, borderColor: '#FF3B30', borderWidth: 1 },
    logoutText: { color: '#FF3B30' },
    footer: { textAlign: 'center', marginTop: 20, color: '#aaa' },
});