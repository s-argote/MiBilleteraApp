import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as Crypto from "expo-crypto";

/**
 * Servicio para manejo de imágenes (subida / borrado) compatible con URIs "content://" en Android APK.
 */
export const ImageService = {
    /** Convierte una URI de RN a Blob usando XMLHttpRequest (más fiable en Android APK). */
    async uriToBlob(uri: string): Promise<Blob> {
        return await new Promise<Blob>((resolve, reject) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.onerror = () => reject(new Error("Network request failed"));
                xhr.responseType = "blob";
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error(`Failed to fetch blob, status: ${xhr.status}`));
                        }
                    }
                };
                xhr.open("GET", uri, true);
                // En Android las URIs 'content://' requieren responseType blob y no funcionan bien con fetch().blob()
                xhr.send(null);
            } catch (err) {
                reject(err);
            }
        });
    },

    /** Intenta deducir contentType desde la URI; si no, devuelve image/jpeg */
    guessContentType(uri: string): string {
        try {
            const lower = uri.toLowerCase();
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".gif")) return "image/gif";
        } catch (e) {
            // noop
        }
        return "image/jpeg";
    },

    /** Sube una imagen y devuelve su URL pública */
    async uploadImage(uri: string): Promise<string> {
        try {
            const storage = getStorage();
            const imageId = Crypto.randomUUID?.() ?? String(Date.now());
            const imagePath = `transactions/${imageId}.jpg`;
            const imageRef = ref(storage, imagePath);

            // Convertir la URI a blob de forma fiable
            const blob = await this.uriToBlob(uri);
            const contentType = this.guessContentType(uri);

            await uploadBytes(imageRef, blob, { contentType });
            const url = await getDownloadURL(imageRef);
            return url;
        } catch (error) {
            console.error("Error al subir imagen:", error);
            throw error;
        }
    },

    /** Elimina una imagen a partir de su URL de Storage */
    async deleteImage(url: string): Promise<void> {
        try {
            if (!url) return;

            const storage = getStorage();

            // Extraer path codificado tras '/o/' y decodificar
            const parts = url.split("/o/");
            if (parts.length < 2) {
                console.warn("Formato inesperado de URL de Storage al intentar borrar:", url);
                return;
            }
            const pathAndQuery = parts[1];
            const pathEncoded = pathAndQuery.split("?")[0];
            const decodedPath = decodeURIComponent(pathEncoded);

            const imageRef = ref(storage, decodedPath);
            await deleteObject(imageRef);
        } catch (error) {
            console.warn("No se pudo borrar la imagen anterior:", error);
        }
    },

    /** Reemplaza la imagen anterior por una nueva (sube nueva y borra la antigua si existe) */
    async replaceImage(newUri: string, oldUrl?: string | null): Promise<string> {
        try {
            const newUrl = await this.uploadImage(newUri);
            if (oldUrl) {
                // No hacer fallar la operación si el borrado falla
                try {
                    await this.deleteImage(oldUrl);
                } catch (err) {
                    console.warn("Error borrando imagen antigua tras reemplazo:", err);
                }
            }
            return newUrl;
        } catch (error) {
            console.error("Error reemplazando imagen:", error);
            throw error;
        }
    }
};