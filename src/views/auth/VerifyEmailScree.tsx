import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../services/firebase";
import { sendEmailVerification } from "firebase/auth";

export const VerifyEmailScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);

    const user = auth.currentUser;

    const handleResend = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await sendEmailVerification(user);
            Alert.alert("Correo enviado", "Revisa nuevamente tu bandeja de entrada.");
        } catch (error) {
            Alert.alert("Error", "No se pudo reenviar el correo.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!user) return;

        try {
            setLoading(true);
            await user.reload();

            if (user.emailVerified) {
                Alert.alert("¡Correo verificado!", "Ya puedes iniciar sesión.");
                navigation.replace("Iniciar Sesión");
            } else {
                Alert.alert("Aún no verificado", "Por favor revisa tu correo.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo comprobar el estado.");
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

                <Text style={styles.message}>
                    Te enviamos un mensaje de verificación a:
                </Text>

                <Text style={styles.email}>{user?.email}</Text>

                <Text style={styles.message2}>
                    Debes verificar tu correo para continuar usando la aplicación.
                </Text>

                {/* BOTÓN REENVIAR */}
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

                {/* BOTÓN COMPROBAR */}
                <TouchableOpacity
                    style={styles.button}
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
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginTop: 50,
        marginBottom: 20,
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 10,
        color: "#333",
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        color: "#555",
    },
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
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    link: {
        marginTop: 14,
        color: "#007AFF",
        fontWeight: "600",
    },
});
