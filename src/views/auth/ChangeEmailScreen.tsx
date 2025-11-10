import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";
import { useAuthContext } from "../../context/AuthContext";

export const ChangeEmailScreen = ({ navigation }: any) => {
    const { user } = useAuthContext();

    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        if (!newEmail.includes("@")) return Alert.alert("Correo inválido");
        if (password.trim() === "") return Alert.alert("Debes ingresar tu contraseña");

        try {
            setLoading(true);

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            await updateEmail(user, newEmail);

            Alert.alert("Correo actualizado", "Revisa tu bandeja para verificarlo.");
            navigation.goBack();
        } catch (error: any) {
            console.log(error);

            if (error.code === "auth/wrong-password") return Alert.alert("Contraseña incorrecta");

            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Realizar cambio de correo</Text>

            <Text style={styles.label}>Nuevo correo</Text>
            <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleChange}>
                <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: "#fff" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    label: { fontSize: 14, marginTop: 10 },
    input: {
        padding: 12,
        borderWidth: 1, borderColor: "#ccc",
        borderRadius: 8,
        marginTop: 5
    },
    button: {
        marginTop: 30,
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
