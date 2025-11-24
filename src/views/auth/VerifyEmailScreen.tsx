import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../../services/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useAuthContext } from "../../context/AuthContext";

const { width } = Dimensions.get('window');

export const VerifyEmailScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const { refreshUser } = useAuthContext();
    const user = auth.currentUser;

    const handleResend = async () => {
        if (!user) return;
        try {
            setResendLoading(true);
            await sendEmailVerification(user);
            Alert.alert("¡Correo reenviado!", "Revisa nuevamente tu bandeja de entrada y carpeta de spam.");
        } catch (error) {
            Alert.alert("Error", "No se pudo reenviar el correo. Intenta más tarde.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleCheckVerification = async () => {
        if (!user) return;
        try {
            setLoading(true);
            await refreshUser();

            if (auth.currentUser?.emailVerified) {
                Alert.alert("¡Correo verificado!", "Tu cuenta ha sido verificada exitosamente.");
                navigation.replace("Iniciar Sesión");
            } else {
                Alert.alert("Aún no verificado", "Por favor revisa tu correo y haz clic en el enlace de verificación.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo comprobar el estado del correo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={verifyStyles.safeArea}>
            <TouchableOpacity
                style={verifyStyles.backButton}
                onPress={() => navigation.navigate("Registro")}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={verifyStyles.container}>
                {/* Illustration */}
                <View style={verifyStyles.illustrationContainer}>
                    <View style={verifyStyles.emailIconContainer}>
                        <LinearGradient
                            colors={['#3B82F6', '#60A5FA']}
                            style={verifyStyles.emailIconGradient}
                        >
                            <Ionicons name="mail" size={60} color="#FFFFFF" />
                        </LinearGradient>
                    </View>
                    <View style={verifyStyles.checkBadge}>
                        <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                    </View>
                </View>

                {/* Content Card */}
                <View style={verifyStyles.card}>
                    <Text style={verifyStyles.title}>Verifica tu correo</Text>
                    <Text style={verifyStyles.message}>
                        Te enviamos un mensaje de verificación a:
                    </Text>

                    <View style={verifyStyles.emailContainer}>
                        <Ionicons name="mail-open" size={18} color="#3B82F6" />
                        <Text style={verifyStyles.email}>{user?.email}</Text>
                    </View>

                    <View style={verifyStyles.stepsContainer}>
                        <View style={verifyStyles.stepItem}>
                            <View style={verifyStyles.stepNumber}>
                                <Text style={verifyStyles.stepNumberText}>1</Text>
                            </View>
                            <Text style={verifyStyles.stepText}>
                                Abre tu correo electrónico
                            </Text>
                        </View>
                        <View style={verifyStyles.stepItem}>
                            <View style={verifyStyles.stepNumber}>
                                <Text style={verifyStyles.stepNumberText}>2</Text>
                            </View>
                            <Text style={verifyStyles.stepText}>
                                Haz clic en el enlace de verificación
                            </Text>
                        </View>
                        <View style={verifyStyles.stepItem}>
                            <View style={verifyStyles.stepNumber}>
                                <Text style={verifyStyles.stepNumberText}>3</Text>
                            </View>
                            <Text style={verifyStyles.stepText}>
                                Vuelve aquí y presiona "Ya verifiqué"
                            </Text>
                        </View>
                    </View>

                    {/* Info Alert */}
                    <View style={verifyStyles.infoAlert}>
                        <Ionicons name="information-circle" size={20} color="#3B82F6" />
                        <Text style={verifyStyles.infoText}>
                            No olvides revisar tu carpeta de spam
                        </Text>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity
                        style={verifyStyles.primaryButton}
                        onPress={handleCheckVerification}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={verifyStyles.primaryGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark-done" size={22} color="#FFFFFF" />
                                    <Text style={verifyStyles.primaryButtonText}>Ya verifiqué</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
};

const verifyStyles = StyleSheet.create({
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
        marginBottom: 12,
        marginLeft: 20,
        marginTop: 16,
    },
    container: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    illustrationContainer: {
        position: 'relative',
        marginTop: 20,
        marginBottom: 40,
    },
    emailIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    emailIconGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2FF',
        padding: 14,
        borderRadius: 12,
        gap: 10,
        marginBottom: 24,
    },
    email: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E40AF',
    },
    stepsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    infoAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        padding: 12,
        borderRadius: 10,
        gap: 10,
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        fontWeight: '500',
    },
    primaryButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 12,
    },
    primaryGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    primaryButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
    },
});