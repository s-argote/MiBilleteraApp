import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../../context/AuthContext';

export const AccountScreen = ({ navigation }: any) => {
    const { logout, profile, user } = useAuthContext();

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

    const menuSections = [
        {
            title: 'Cuenta',
            items: [
                {
                    label: "Mi Perfil",
                    icon: "person-circle",
                    route: "Perfil",
                    color: '#3B82F6',
                    bgColor: '#EEF2FF'
                },
                {
                    label: "Alertas y Metas",
                    icon: "notifications",
                    route: "Alertas y Metas",
                    color: '#F59E0B',
                    bgColor: '#FEF3C7'
                },
            ]
        },
        {
            title: 'Actividad',
            items: [
                {
                    label: "Historial",
                    icon: "time",
                    route: "Historial",
                    color: '#8B5CF6',
                    bgColor: '#F3E8FF'
                },
            ]
        }
    ];

    const getInitials = () => {
        const name = profile?.name || user?.email || "U";
        if (profile?.name) {
            const parts = name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
        }
        return name[0].toUpperCase();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card con gradiente */}
                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={['#1E40AF', '#3B82F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileGradient}
                    >
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={['#FFFFFF', '#F3F4F6']}
                                    style={styles.avatar}
                                >
                                    <Text style={styles.avatarText}>
                                        {getInitials()}
                                    </Text>
                                </LinearGradient>
                                <View style={styles.avatarBadge}>
                                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {profile?.name || "Usuario"}
                            </Text>
                            <View style={styles.emailContainer}>
                                <Ionicons name="mail" size={14} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.profileEmail}>
                                    {user?.email}
                                </Text>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Ionicons name="wallet" size={20} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.statValue}>Activo</Text>
                                <Text style={styles.statLabel}>Estado</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Ionicons name="calendar" size={20} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.statValue}>
                                    {new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                </Text>
                                <Text style={styles.statLabel}>Miembro desde</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.menuCard}>
                            {section.items.map((item, itemIndex) => (
                                <React.Fragment key={itemIndex}>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => navigation.navigate(item.route)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.menuItemLeft}>
                                            <View style={[
                                                styles.menuIconContainer,
                                                { backgroundColor: item.bgColor }
                                            ]}>
                                                <Ionicons
                                                    name={item.icon as any}
                                                    size={24}
                                                    color={item.color}
                                                />
                                            </View>
                                            <Text style={styles.menuItemText}>{item.label}</Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                    {itemIndex < section.items.length - 1 && (
                                        <View style={styles.menuDivider} />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Cuenta Verificada</Text>
                        <Text style={styles.infoText}>
                            Tu cuenta está protegida y verificada
                        </Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogoutPress}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.logoutGradient}
                    >
                        <Ionicons name="log-out" size={22} color="#FFFFFF" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footerContainer}>
                    <View style={styles.footerDivider} />
                    <View style={styles.footerContent}>
                        <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.footerText}>MiBilleteraApp</Text>
                        <View style={styles.footerDot} />
                        <Text style={styles.footerText}>v1.0.0</Text>
                    </View>
                    <Text style={styles.footerCopyright}>
                        © 2025 Todos los derechos reservados
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    // Content
    content: {
        padding: 20,
        paddingBottom: 40,
    },

    // Profile Card
    profileCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    profileGradient: {
        padding: 24,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1E40AF',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 2,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 16,
    },

    // Menu Section
    menuSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 78,
    },

    // Info Card
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#ECFDF5',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    infoIconContainer: {
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#065F46',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#047857',
        lineHeight: 18,
    },

    // Logout Button
    logoutButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 32,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Footer
    footerContainer: {
        alignItems: 'center',
        gap: 12,
    },
    footerDivider: {
        width: 60,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 8,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    footerDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    footerCopyright: {
        fontSize: 12,
        color: '#D1D5DB',
        fontWeight: '400',
    },
});