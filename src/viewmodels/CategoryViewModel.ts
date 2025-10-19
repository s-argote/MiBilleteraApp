import { useState, useEffect } from 'react';
import { CategoryService } from '../services/CategoryService';

//ViewModel para gestionar el estado y la lógica de negocio de las categorías/
export const useCategoryViewModel = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    //Carga las categorías del usuario desde Firestore.
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

    /**
     * Agrega una nueva categoría.
     * @param {string} name - Nombre de la categoría.
     * @param {string} color - Color de la categoría.
     */
    const addCategory = async (name: string, color: string) => {
        try {
            await CategoryService.addCategory({ name, color });
            await loadCategories(); // Recarga la lista.
        } catch (error) {
            console.error("Error al agregar categoría:", error);
        }
    };

    /**
     * Elimina una categoría.
     * @param {string} id - ID de la categoría.
     */
    const deleteCategory = async (id: string) => {
        try {
            await CategoryService.deleteCategory(id);
            await loadCategories(); // Recarga la lista.
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
        }
    };

    /**
     * Actualiza una categoría existente.
     * @param {string} id - ID de la categoría.
     * @param {Object} data - Nuevos datos (nombre y/o color).
     */
    const updateCategory = async (id: string, data: { name?: string; color?: string }) => {
        try {
            await CategoryService.updateCategory(id, data);
            await loadCategories(); // Recarga la lista.
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
        }
    };

    // Cargar categorías cuando el ViewModel se inicializa.
    useEffect(() => {
        loadCategories();
    }, []);

    return {
        categories,
        loading,
        addCategory,
        deleteCategory,
        updateCategory,
        loadCategories, // Para recargar manualmente si es necesario.
    };
};