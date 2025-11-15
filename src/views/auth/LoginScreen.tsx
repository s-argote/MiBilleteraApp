import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuthViewModel } from "../../viewmodels/AuthViewModel";
import { LoginStyles as styles } from "../../styles/LoginStyles";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
 
export const LoginScreen = () => {
  const { email, setEmail, password, setPassword, loading, error, setError, handleLogin, handlePasswordReset,
  } = useAuthViewModel();
 
  const { refreshUser } = useAuthContext();
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
 
  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);
 
  const onLoginPress = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingresa tu correo y contraseña.");
      return;
    }
 
    try {
      const loggedUser = await handleLogin();
 
      // Refresca para obtener emailVerified actualizado
      await refreshUser();
 
      if (!loggedUser.emailVerified) {
        Alert.alert("Correo no verificado", "Por favor verifica tu correo antes de continuar.");
        return;
      }
 
 
    } catch (err: any) {
      Alert.alert("Error de Inicio de Sesión", error || "Credenciales inválidas.");
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
          <Text style={styles.title}>Iniciar Sesión</Text>
 
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { color: "#000" }]}
            placeholderTextColor="#999"
          />
 
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Text style={{ fontSize: 16 }}>{showPassword ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>
 
          <TouchableOpacity
            onPress={() => {
              if (!email.trim()) {
                Alert.alert("Correo requerido", "Ingresa tu correo para continuar.");
                return;
              }
              handlePasswordReset();
              Alert.alert(
                "Revisa tu correo",
                "Te enviamos un enlace para recuperar tu contraseña."
              );
            }}
          >
            <Text
              style={styles.resetPasswordLink}
              onPress={() => navigation.navigate("RecuperarContraseña")}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
 
          {!!error && <Text style={styles.errorText}>{error}</Text>}
 
          <TouchableOpacity
            style={styles.button}
            onPress={onLoginPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
 
          <Text style={styles.registerText}>
            ¿No tienes cuenta?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Registro")}
            >
              Regístrate
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};