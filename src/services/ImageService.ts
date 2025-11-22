import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as Crypto from "expo-crypto";

export const ImageService = {

    /** Sube una imagen y devuelve su URL */
    async uploadImage(uri: string): Promise<string> {
        try {
            const storage = getStorage();

            const imageId = Crypto.randomUUID(); // 👈 YA COMPATIBLE CON EXPO GO
            const imageRef = ref(storage, `transactions/${imageId}.jpg`);

            const response = await fetch(uri);
            const blob = await response.blob();

            await uploadBytes(imageRef, blob);

            const url = await getDownloadURL(imageRef);
            return url;

        } catch (error) {
            console.error("Error al subir imagen:", error);
            throw error;
        }
    },

    /** Elimina una imagen usando su URL */
    async deleteImage(url: string): Promise<void> {
        try {
            if (!url) return;

            const storage = getStorage();
            const path = url.split("/o/")[1].split("?")[0];
            const decodedPath = decodeURIComponent(path);

            const imageRef = ref(storage, decodedPath);

            await deleteObject(imageRef);

        } catch (error) {
            console.warn("No se pudo borrar la imagen anterior:", error);
        }
    },

    /** Reemplaza la imagen anterior por una nueva */
    async replaceImage(newUri: string, oldUrl?: string | null): Promise<string> {
        try {
            const newUrl = await this.uploadImage(newUri);

            if (oldUrl) {
                await this.deleteImage(oldUrl);
            }

            return newUrl;

        } catch (error) {
            console.error("Error reemplazando imagen:", error);
            throw error;
        }
    }
};
