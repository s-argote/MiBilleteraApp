import { StyleSheet } from 'react-native';

export const WelcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C2C54',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6D6D6D',
        marginBottom: 40,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 80,
        borderRadius: 8,
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        borderColor: '#007AFF',
        borderWidth: 2,
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 8,
    },
    registerButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
