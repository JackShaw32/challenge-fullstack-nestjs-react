import { User, Post } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Juan García',
    email: 'juan@example.com',
    password: 'password123',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'María López',
    email: 'maria@example.com',
    password: 'password123',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    id: 'user-3',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    password: 'password123',
    created_at: '2024-02-01T09:15:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Introducción a NestJS',
    content: 'NestJS es un framework para construir aplicaciones del lado del servidor eficientes y escalables. Utiliza TypeScript por defecto y combina elementos de OOP (Programación Orientada a Objetos), FP (Programación Funcional) y FRP (Programación Funcional Reactiva).',
    user_id: 'user-1',
    created_at: '2024-01-16T11:00:00Z',
  },
  {
    id: 'post-2',
    title: 'React Hooks en Profundidad',
    content: 'Los Hooks son una característica de React que permite usar estado y otras características de React sin escribir una clase. useState, useEffect, useContext son los más utilizados, pero hay muchos más que explorar.',
    user_id: 'user-2',
    created_at: '2024-01-21T15:45:00Z',
  },
  {
    id: 'post-3',
    title: 'PostgreSQL vs MySQL',
    content: 'PostgreSQL ofrece características avanzadas como soporte para JSON, arrays, y tipos de datos personalizados. Es ideal para aplicaciones que requieren integridad de datos y consultas complejas.',
    user_id: 'user-1',
    created_at: '2024-01-25T08:30:00Z',
  },
  {
    id: 'post-4',
    title: 'Autenticación con JWT',
    content: 'JSON Web Tokens (JWT) es un estándar abierto que define una forma compacta y autónoma de transmitir información de forma segura entre partes como un objeto JSON. Es perfecto para autenticación stateless.',
    user_id: 'user-3',
    created_at: '2024-02-02T12:00:00Z',
  },
  {
    id: 'post-5',
    title: 'TypeORM: El ORM para TypeScript',
    content: 'TypeORM es un ORM que puede ejecutarse en NodeJS y puede usarse con TypeScript y JavaScript. Soporta tanto Active Record como Data Mapper patterns, lo que te da flexibilidad en cómo estructuras tu código.',
    user_id: 'user-2',
    created_at: '2024-02-05T16:20:00Z',
  },
];

export const getPostsWithUsers = (): Post[] => {
  return mockPosts.map(post => ({
    ...post,
    user: mockUsers.find(u => u.id === post.user_id),
  }));
};

export const getPostById = (id: string): Post | undefined => {
  const post = mockPosts.find(p => p.id === id);
  if (post) {
    return {
      ...post,
      user: mockUsers.find(u => u.id === post.user_id),
    };
  }
  return undefined;
};

export const getUserById = (id: string): User | undefined => {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return undefined;
};

export const getPostsByUserId = (userId: string): Post[] => {
  return mockPosts.filter(p => p.user_id === userId);
};
