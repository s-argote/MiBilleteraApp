import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoriesScreen } from '../views/categories/CategoriesScreen';
import { AddCategoriesScreen } from '../views/categories/AddCategoriesScreen';
import { EditCategoriesScreen } from '../views/categories/EditCategoriesScreen';

const Stack = createNativeStackNavigator();

export const CategoriesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListaCategorías"
                component={CategoriesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Nueva Categoría"
                component={AddCategoriesScreen}
                options={{
                    headerShown: true,
                    title: 'Nueva Categoría',
                    headerBackTitle: 'Volver',
                }}
            />
            <Stack.Screen
                name="Editar Categoría"
                component={EditCategoriesScreen}
                options={{ title: 'Editar Categoría' }}
            />
        </Stack.Navigator>
    );
};