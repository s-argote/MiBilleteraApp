import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthViewModel } from '../../viewmodels/AuthViewModel';
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
export const AccountScreen = ({ navigation }: any) => {
    const { handleLogout } = useAuthViewModel();
    const [profile, setProfile] = useState<any>(null);
    const scaleAnim = new Animated.Value(1);
    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true })
        ]).start();
    };
    useEffect(() => {
        const loadProfile = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) setProfile(snap.data());
        };
        loadProfile();
    }, []);
    const handleLogoutPress = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar Sesión', style: 'destructive', onPress: handleLogout },
            ]
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER - PERFIL */}
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(profile?.name?.[0] || auth.currentUser?.email?.[0] || "U").toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.profileName}>
                    {profile?.name || "Usuario"}
                </Text>
                <Text style={styles.profileEmail}>
                    {auth.currentUser?.email}
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
            {/* FOOTER */}
            <Text style={styles.footer}>MiBilleteraApp • versión 1.0.0</Text>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F5F9",
        alignItems: "center"
    },
    // Perfil
    profileContainer: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 32,
        backgroundColor: "white",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#007AFF20",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: "700",
        color: "#007AFF",
    },
    profileName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
    },
    profileEmail: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
    },
    // Botones
    buttonsContainer: {
        width: "90%",
        marginTop: 10,
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 14,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 12,
        color: "#333",
    },
    logoutButton: {
        backgroundColor: "#FFF4F4",
    },
    logoutText: {
        color: "#FF3B30",
    },
    footer: {
        marginTop: 20,
        color: "#9CA3AF",
        fontSize: 12,
    }
});