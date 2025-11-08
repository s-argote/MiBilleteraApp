import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountScreen } from '../views/account/AccountScreen';
import { ProfileScreen } from '../views/account/ProfileScreen';
import { BudgetsScreen } from '../views/account/BudgetsScreen';
import { HistoryScreen } from '../views/account/HistoryScreen';
const Stack = createNativeStackNavigator();
export const AccountStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Mi Cuenta" component={AccountScreen} />
            <Stack.Screen name="Perfil" component={ProfileScreen}
                options={{
                    headerShown: true,
                    title: 'Mi Cuenta',
                    headerBackTitle: 'Volver',
                }} />
            <Stack.Screen name="Alertas y Metas" component={BudgetsScreen}
                options={{
                    headerShown: true,
                    title: 'Alertas y Metas',
                    headerBackTitle: 'Volver',
                }} />
            <Stack.Screen name="Historial" component={HistoryScreen}
                options={{
                    headerShown: true,
                    title: 'Historial',
                    headerBackTitle: 'Volver',
                }} />
        </Stack.Navigator>
    );
};