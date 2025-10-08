import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransactionsScreen } from '../views/transactions/TransactionsScreen'; // Asegúrate de que la ruta sea correcta
import { AddTransactionsScreen } from '../views/transactions/AddTransactionsScreen'; // Asegúrate de que la ruta sea correcta
import { EditTransactionsScreen } from '../views/transactions/EditTransactionsScreen'; // Asegúrate de que la ruta sea correcta

const Stack = createNativeStackNavigator();

export const TransactionsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListaTransacciones"
                component={TransactionsScreen}
                options={{ headerShown: false }} // La pantalla principal gestiona su propio header
            />
            <Stack.Screen
                name="Agregar Transacción"
                component={AddTransactionsScreen}
                options={{
                    headerShown: true,
                    title: 'Nueva Transacción',
                    headerBackTitle: 'Volver',
                }}
            />
            <Stack.Screen
                name="Editar Transacción"
                component={EditTransactionsScreen}
                options={{
                    headerShown: true,
                    title: 'Editar Transacción',
                    headerBackTitle: 'Volver',
                }}
            />
        </Stack.Navigator>
    );
};