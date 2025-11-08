import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export const HistoryScreen = () => {

    return (
<SafeAreaView style={styles.container}>
<View style={styles.header}>
<Text style={styles.title}>Historial y Exportación</Text>
</View>
<View style={styles.content}>
<Text>RF17: Lista de transacciones con filtros y botón de exportación.</Text>
</View>
</SafeAreaView>

    );

};

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#f8f9fa' },

    header: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        alignItems: 'center',

        paddingHorizontal: 20,

        paddingVertical: 16,

        backgroundColor: '#fff',

        borderBottomWidth: 1,

        borderBottomColor: '#eee',

    },

    title: { fontSize: 20, fontWeight: '600', color: '#333' },

    content: { flex: 1, padding: 20 },

});
 