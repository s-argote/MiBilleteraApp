import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../views/dashboard/HomeScreen';
import { CategoriesStack } from '../navigation/CategoriesStack';
import { TransactionsScreen } from '../views/transactions/TransactionsScreen';
import { AccountScreen } from '../views/account/AccountScreen';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 4,
                    marginTop: 0,
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                },
            }}
        >
            <Tab.Screen
                name="Resumen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Resumen',
                }}
            />
            <Tab.Screen
                name="Categorías"
                component={CategoriesStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="category" size={size} color={color} />
                    ),
                    tabBarLabel: 'Categorías',
                }}
            />
            <Tab.Screen
                name="Mis Transacciones"
                component={TransactionsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="exchange" size={size} color={color} />
                    ),
                    tabBarLabel: 'Transacciones',
                }}
            />
            <Tab.Screen
                name="Cuenta"
                component={AccountScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                    tabBarLabel: 'Cuenta',
                }}
            />
        </Tab.Navigator>
    );
};