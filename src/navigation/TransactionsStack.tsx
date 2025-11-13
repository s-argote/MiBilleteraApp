import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionsScreen } from '../views/transactions/TransactionsScreen';
import { AddTransactionsScreen } from '../views/transactions/AddTransactionsScreen';
import { EditTransactionsScreen } from '../views/transactions/EditTransactionsScreen';

const Stack = createNativeStackNavigator();

export const TransactionsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Lista Transacciones"
                component={TransactionsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Agregar Transacción"
                component={AddTransactionsScreen}
                options={{
                    headerShown: false,
                    title: 'Nueva Transacción',
                    headerBackTitle: 'Volver',
                }}
            />
            <Stack.Screen
                name="Editar Transacción"
                component={EditTransactionsScreen}
                options={{
                    headerShown: false,
                    title: 'Editar Transacción',
                    headerBackTitle: 'Volver',
                }}
            />
        </Stack.Navigator>
    );
};