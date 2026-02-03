# Fullstack Challenge - React + NestJS + PostgreSQL

Solución al desafío técnico Fullstack. El proyecto está estructurado como un monorepo dividido en dos aplicaciones:

- **Backend:** API RESTful (NestJS + TypeORM + PostgreSQL).
- **Frontend:** SPA (React + Vite).

## Inicio Rápido (Docker)

La forma más rápida de evaluar el proyecto es utilizando **Docker Compose**.

```bash
# En la raíz del proyecto
docker-compose up --build

Una vez que los contenedores estén corriendo:

Servicio	        URL	                  Descripción
Frontend	http://localhost:5173/	    Interfaz de Usuario
API	        http://localhost:3000/	    Backend REST
Swagger	    http://localhost:3000/api#/	Documentación Interactiva
Seed	    http://localhost:3000/seed/	Poblar DB (Ejecutar al inicio)

Credenciales de Prueba

Rol      	Email	      Password
ADMIN	admin@admin.com	password123
USER	user1@user.com	password123
USER	user2@user.com	password123

Documentación Detallada

Para ver detalles de instalación manual, scripts, tests y arquitectura, revisa la documentación específica de cada módulo:

 Backend README (Variables de entorno, Tests, Arquitectura)
 Frontend README (Scripts, Estilos, Componentes)

Tecnologías Principales

 Backend: NestJS, TypeORM, Passport (JWT), Swagger.
 Frontend: React, TailwindCSS, Axios, React Hook Form.
 Infra: Docker, PostgreSQL.