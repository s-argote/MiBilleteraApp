import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../views/dashboard/HomeScreen";
import { FinancialDetailScreen } from "../views/dashboard/FinancialDetailScreen";

const Stack = createNativeStackNavigator();

export const DashboardStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Resumen Financiero"
                component={HomeScreen}
                options={{ title: "Resumen financiero" }}
            />

            {/* Nueva pantalla */}
            <Stack.Screen
                name="Detalle Financiero"
                component={FinancialDetailScreen}
            />
        </Stack.Navigator>
    );
};
