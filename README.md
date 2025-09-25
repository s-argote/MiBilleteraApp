# MiBilleteraApp

Aplicación móvil desarrollada con **React Native + Expo + TypeScript** bajo la arquitectura **MVVM**.  
La app se conecta a **Firebase** para autenticación, almacenamiento y base de datos.

---

## Requisitos previos

- Node.js (v18 o superior recomendado)
- npm o yarn
- Expo CLI
- Una cuenta en [Firebase Console](https://console.firebase.google.com/)

---

## Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd MiBilleteraApp

2. Instalar dependencias

npm install
# o con yarn
yarn install

3. Configurar variables de entorno

El proyecto utiliza react-native-dotenv y variables en un archivo .env.

Copia el archivo de ejemplo:

cp .env.example .env

Edita .env y coloca las credenciales de Firebase de tu proyecto.

Ejemplo de .env:

EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefgh

El archivo .env está en .gitignore y no debe subirse al repositorio.

4. Ejecución

Para correr la aplicación en modo desarrollo:

npx expo start

5. Estructura del proyecto
src/
 ├── components/      # Componentes reutilizables (UI, charts, forms, etc.)
 ├── hooks/           # Custom hooks
 ├── models/          # Definiciones de datos
 ├── navigation/      # Configuración de navegación
 ├── services/        # Firebase, APIs y lógica de negocio
 ├── styles/          # Estilos globales
 ├── utils/           # Utilidades/helpers
 ├── viewmodels/      # Lógica de presentación (MVVM)
 └── views/           # Pantallas (Login, Register, Dashboard, etc.)


6. Notas de seguridad

Nunca subas .env al repositorio.

Usa .env.example para que los demás desarrolladores sepan qué variables necesitan.

En caso de pérdida de credenciales, regenera las claves desde Firebase Console.

7. Scripts útiles

npm run lint → Corre el linter.

npm run start → Inicia Expo.

npm run android → Ejecuta en emulador/dispositivo Android.

npm run ios → Ejecuta en simulador iOS (solo macOS).