import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../services/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "../../context/AuthContext";

export const VerifyEmailScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useAuthContext();
    const user = auth.currentUser;

    const handleResend = async () => {
        if (!user) return;
        try {
            setLoading(true);
            await sendEmailVerification(user);
            Alert.alert("Correo reenviado", "Revisa nuevamente tu bandeja de entrada.");
        } catch (error) {
            Alert.alert("Error", "No se pudo reenviar el correo.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!user) return;
        try {
            setLoading(true);
            await refreshUser();

            if (auth.currentUser?.emailVerified) {
                Alert.alert("¡Correo verificado!", "Ya puedes iniciar sesión.");
                navigation.replace("Iniciar Sesión");
            } else {
                Alert.alert("Aún no verificado", "Por favor revisa tu correo nuevamente.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo comprobar el estado del correo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../../../assets/images/logo.png")}
                style={styles.logo}
            />

            <View style={styles.card}>
                <Text style={styles.title}>Verifica tu correo</Text>
                <Text style={styles.message}>Te enviamos un mensaje de verificación a:</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <Text style={styles.message2}>
                    Una vez lo confirmes, presiona el botón “Ya verifiqué” para continuar.
                </Text>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleResend}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#007AFF" />
                    ) : (
                        <Text style={[styles.buttonText, { color: "#007AFF" }]}>
                            Reenviar correo
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleCheckVerification}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Ya verifiqué</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa", alignItems: "center" },
    logo: {
        width: 120,
        height: 120,
        marginTop: 60,
        marginBottom: 30,
        resizeMode: "contain",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 28,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 10, color: "#333" },
    message: { fontSize: 16, textAlign: "center", color: "#555" },
    email: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginVertical: 8,
        color: "#007AFF",
    },
    message2: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 25,
        color: "#666",
    },
    button: {
        width: "100%",
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    secondaryButton: {
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#007AFF",
    },
    buttonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});

