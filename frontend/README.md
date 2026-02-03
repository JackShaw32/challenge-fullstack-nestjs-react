# Frontend - Fullstack Challenge

Aplicación web moderna desarrollada con **React** y **Vite**, diseñada para interactuar con la API REST del desafío. Enfocada en la experiencia de usuario, rendimiento y código limpio.

## Tecnologías Utilizadas

- **Core:** React 18, TypeScript, Vite.
- **Estilos:** Tailwind CSS.
- **Componentes UI:** Shadcn/ui (Radix UI) + Lucide React.
- **Estado y API:** Context API (Auth) + Fetch personalizado.
- **Enrutamiento:** React Router DOM v6.
- **Formularios:** React Hook Form + Zod (Validaciones estrictas).
- **Testing:** Vitest + React Testing Library.

## Guía de Inicio

### Requisitos
El Backend debe estar ejecutándose (ya sea localmente o vía Docker) en el puerto `3000`.

### 1. Instalación

```bash
cd frontend
pnpm install

2. Configuración
Crea un archivo .env en la raíz del frontend:

VITE_API_URL=http://localhost:3000

3. Ejecución

pnpm run dev

- Funcionalidades Detalladas
- Perfil de Usuario y Avatar
Edición Completa: Los usuarios pueden actualizar su nombre y subir una nueva imagen de perfil (avatar).
Previsualización: Al cargar una imagen, se muestra una vista previa antes de guardar.
Historial: Visualización de todas las publicaciones propias en el perfil.
- Gestión de Publicaciones (Posts)
Creación: Editor de texto para nuevos posts.
Edición y Actualización: Los usuarios pueden modificar el título y contenido de sus publicaciones existentes.
Eliminación: Borrado de publicaciones propias con confirmación.
- Moderación (Rol Admin)
El sistema reconoce roles de usuario. Si el usuario logueado tiene rol ADMIN:

Puede editar el contenido de cualquier publicación (no solo las propias).
Puede eliminar cualquier publicación ofensiva o incorrecta de cualquier usuario.
- Testing

pnpm test