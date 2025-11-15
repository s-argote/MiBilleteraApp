import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/AuthService";
 
export const ForgotPasswordScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
 
    const onRecoverPress = async () => {
        if (!email.trim()) {
            Alert.alert("Correo requerido", "Por favor ingresa tu correo.");
            return;
        }
 
        try {
            setLoading(true);
            await AuthService.resetPassword(email.trim());
            Alert.alert(
                "Correo enviado",
                "Te enviamos un enlace para restablecer tu contraseña."
            );
            navigation.goBack();
        } catch (e: any) {
            Alert.alert("Error", e.message || "No se pudo enviar el correo.");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
 
                <Image
                    source={require("../../../assets/images/logo.png")}
                    style={styles.logo}
                />
 
                <View style={styles.card}>
                    <Text style={styles.title}>Recuperar Contraseña</Text>
                    <Text style={styles.subtitle}>
                        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </Text>
 
                    <TextInput
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { color: "#000" }]}
                        placeholderTextColor="#999"
                    />
 
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onRecoverPress}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Enviar enlace</Text>
                        )}
                    </TouchableOpacity>
 
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backLink}
                    >
                        <Text style={styles.backText}>Volver al inicio de sesión</Text>
                    </TouchableOpacity>
                </View>
 
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    scrollContainer: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginTop: 200,
        marginBottom: 20,
    },
    card: {
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: "#007AFF",
        marginBottom: 8,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    backLink: {
        alignItems: "center",
        paddingVertical: 4,
    },
    backText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },
});