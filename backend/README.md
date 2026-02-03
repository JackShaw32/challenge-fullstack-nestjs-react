# Backend - Fullstack Challenge

API RESTful construida con **NestJS**, **TypeORM** y **PostgreSQL**.
Diseñada bajo arquitectura modular, principios SOLID y documentación automática.

## Tecnologías

- **NestJS**: Framework progresivo de Node.js.
- **TypeORM**: ORM para manejo de base de datos y migraciones.
- **PostgreSQL**: Motor de base de datos relacional.
- **JWT + Passport**: Estrategia de autenticación segura.
- **Swagger**: Documentación interactiva de la API.
- **Docker**: Contenedorización para desarrollo y despliegue.

## Instalación y Ejecución

### Opción A: Con Docker (Recomendado)
La forma más fácil de levantar todo el entorno (Base de datos + API) sin configurar nada localmente.

```bash
# En la raíz del proyecto (donde está docker-compose.yml)
docker-compose up --build

La API estará disponible en: http://localhost:3000

Opción B: Ejecución Local (Manual)
Instalar dependencias: pnpm install

Configurar entorno: Crea un archivo .env basado en .env.example.
Levantar base de datos: Debes tener PostgreSQL corriendo localmente.
Iniciar servidor: pnpm run start:dev

Variables de Entorno

Nota: Para facilitar la ejecución de este challenge, se proporcionan las variables necesarias para conectar con el contenedor de Docker incluido o para ejecución local.
Crea un archivo .env en la carpeta backend con este contenido:

# Conexión a la base de datos (Usuario: admin, Pass: adminpassword, Host: localhost, Puerto: 5432, DB: challenge_db)
DATABASE_URL=postgres://admin:adminpassword@localhost:5432/challenge_db
# Clave secreta para firmar los tokens de sesión
JWT_SECRET=supersecreto123
# Puerto donde correrá el backend
PORT=3000
# Entorno de desarrollo
NODE_ENV=development

- Poblar Base de Datos (Seed/Script)
(Para facilitar las pruebas, se ha incluido un script que genera usuarios de prueba, avatares y publicaciones automáticamente.)
Pasos:

1-Asegúrese de que el servidor esté corriendo.
2-Haga una petición GET desde su navegador a:  http://localhost:3000/seed Debes ver el JSON de éxito.
3-¡Listo! Ahora abra el Frontend en http://localhost:5173 e inicie sesión con las credenciales de prueba.

Esto creará los siguientes usuarios (contraseña para todos: password123):

Rol	      Email	         Password	          Avatar
ADMIN	admin@admin.com	password123	Rojo  Rojo (Iniciales)
USER	user1@user.com	password123	Azul  Azul (Iniciales)
USER	user2@user.com	password123	Azul  Azul (Iniciales)

(Resetear datos: Si necesita borrar todo para volver a ejecutar el seed, use el comando: docker-compose down -v y vuelva a levantar el proyecto.)

Documentación API (Swagger)

Una vez iniciada la aplicación, puedes ver y probar todos los endpoints en:

  - http://localhost:3000/api#/

  - Gestión de Roles (Admin)
El sistema soporta roles (USER/ADMIN). Por defecto, los usuarios se registran con rol USER.

Para probar funcionalidades de Administrador:
Registre un usuario nuevo desde el Frontend o Swagger.
Ejecute el siguiente comando en su terminal para elevar sus privilegios (asumiendo que usa Docker):

docker exec -it challenge_db psql -U admin -d challenge_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'correo@ejemplo.com';"

(Reemplazar correo@ejemplo.com por el email registrado)

- Arquitectura del Proyecto

src/
├── auth/        # Autenticación, Guards y Estrategias JWT
├── users/       # Gestión de usuarios y perfiles
├── posts/       # Lógica de negocio de publicaciones
├── seed/        # Script de poblado de datos (Seed)
├── common/      # Decoradores (@CurrentUser) y filtros de excepción
├── main.ts      # Configuración global y Swagger

- Testing

# Tests unitarios
pnpm test

# Cobertura de código
pnpm test -- --coverage