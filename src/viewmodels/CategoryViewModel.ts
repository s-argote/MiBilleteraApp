import { useState, useEffect } from 'react';
import { CategoryService } from '../services/CategoryService';
import { TransactionService } from '../services/TransactionService';

// Normalizador robusto
const normalize = (text: string) =>
    text.trim().replace(/\s+/g, " ").toLowerCase();

export const useCategoryViewModel = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar categorías
    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await CategoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        } finally {
            setLoading(false);
        }
    };

    // Validar si ya existe una categoría
    const categoryExists = (name: string): boolean => {
        const clean = normalize(name);
        return categories.some(cat => normalize(cat.name) === clean);
    };

    // Agregar categoría
    const addCategory = async (name: string, color: string) => {
        const cleanName = name.trim().replace(/\s+/g, " ");

        if (categoryExists(cleanName)) {
            throw new Error("Ya existe una categoría con ese nombre.");
        }

        try {
            await CategoryService.addCategory({ name: cleanName, color });
            await loadCategories();
        } catch (error) {
            console.error("Error al agregar categoría:", error);
            throw error;
        }
    };

    // Eliminar categoría + transacciones asociadas
    const deleteCategory = async (id: string) => {
        try {
            // 1. Eliminar transacciones que usen esta categoría
            await TransactionService.deleteTransactionsByCategory(id);

            // 2. Eliminar la categoría
            await CategoryService.deleteCategory(id);

            // 3. Recargar categorías
            await loadCategories();
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            throw error;
        }
    };

    // Actualizar categoría + transacciones
    const updateCategory = async (
        id: string,
        data: { name?: string; color?: string }
    ) => {
        const updatedData: { name?: string; color?: string } = {};

        // Validar nombre si se va a cambiar
        if (data.name != null) {
            const newCleanName = normalize(data.name);

            const exists = categories.some(
                cat => cat.id !== id && normalize(cat.name) === newCleanName
            );

            if (exists) {
                throw new Error("Ya existe una categoría con ese nombre.");
            }

            updatedData.name = data.name.trim().replace(/\s+/g, " ");
        }

        // Validar color
        if (data.color) {
            updatedData.color = data.color;
        }

        try {
            // 1. Actualizar categoría
            await CategoryService.updateCategory(id, updatedData);

            // 2. Actualizar transacciones relacionadas
            await TransactionService.updateTransactionsCategoryColor(id, updatedData);

            // 3. Recargar categorías
            await loadCategories();
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            throw error;
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return {
        categories,
        loading,
        addCategory,
        deleteCategory,
        updateCategory,
        categoryExists,
        loadCategories,
    };
};
