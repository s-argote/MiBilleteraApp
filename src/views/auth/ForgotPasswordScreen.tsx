import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/AuthService";

export const ForgotPasswordScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    const onRecoverPress = async () => {
        if (!email.trim()) {
            Alert.alert("Correo requerido", "Por favor ingresa tu correo electrónico.");
            return;
        }

        try {
            setLoading(true);
            await AuthService.resetPassword(email.trim());
            Alert.alert(
                "¡Correo enviado!",
                "Te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.",
                [
                    {
                        text: "Entendido",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (e: any) {
            Alert.alert("Error", e.message || "No se pudo enviar el correo. Verifica tu dirección.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Illustration Section */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['#F59E0B', '#F97316']}
                                style={styles.iconGradient}
                            >
                                <Ionicons name="key" size={60} color="#FFFFFF" />
                            </LinearGradient>
                        </View>
                        <View style={styles.lockBadge}>
                            <Ionicons name="lock-open" size={28} color="#F59E0B" />
                        </View>
                    </View>

                    {/* Content Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
                        <Text style={styles.subtitle}>
                            No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.
                        </Text>

                        {/* Email Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Correo Electrónico</Text>
                            <View style={[
                                styles.inputContainer,
                                emailFocused && styles.inputContainerFocused
                            ]}>
                                <Ionicons
                                    name="mail"
                                    size={20}
                                    color={emailFocused ? "#3B82F6" : "#9CA3AF"}
                                />
                                <TextInput
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    placeholderTextColor="#9CA3AF"
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                />
                            </View>
                        </View>


                        {/* Send Button */}
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={onRecoverPress}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#F59E0B', '#F97316']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.sendGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="send" size={22} color="#FFFFFF" />
                                        <Text style={styles.sendButtonText}>Enviar Enlace</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Back Link */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backLink}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back-circle" size={20} color="#3B82F6" />
                            <Text style={styles.backText}>Volver al inicio de sesión</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Steps Card */}
                    <View style={styles.stepsCard}>
                        <Text style={styles.stepsTitle}>¿Qué sucede después?</Text>
                        <View style={styles.stepsList}>
                            <View style={styles.stepItem}>
                                <View style={[styles.stepIcon, { backgroundColor: '#DBEAFE' }]}>
                                    <Ionicons name="mail-open" size={18} color="#3B82F6" />
                                </View>
                                <Text style={styles.stepText}>
                                    Recibirás un correo con un enlace seguro
                                </Text>
                            </View>
                            <View style={styles.stepItem}>
                                <View style={[styles.stepIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <Ionicons name="finger-print" size={18} color="#F59E0B" />
                                </View>
                                <Text style={styles.stepText}>
                                    Haz clic en el enlace para crear una nueva contraseña
                                </Text>
                            </View>
                            <View style={styles.stepItem}>
                                <View style={[styles.stepIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                </View>
                                <Text style={styles.stepText}>
                                    Inicia sesión con tu nueva contraseña
                                </Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    gradientHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12,
        marginLeft: 20,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 24,
        paddingBottom: 40,
    },

    // Illustration
    illustrationContainer: {
        position: 'relative',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        position: 'absolute',
        bottom: 0,
        right: '30%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    // Card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },

    // Input Section
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    inputContainerFocused: {
        borderColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#111827',
    },


    // Send Button
    sendButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    sendGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    sendButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Back Link
    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    backText: {
        fontSize: 15,
        color: '#3B82F6',
        fontWeight: '600',
    },

    // Steps Card
    stepsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 24,
    },
    stepsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    stepsList: {
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },

    // Security Badge
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#ECFDF5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'center',
    },
});