export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at: string;
  avatarUrl?: string;
  role?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user?: User;
  user_id: string | number; 
  userId?: string | number;
}
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreatePostDTO {
  title: string;
  content: string;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
}

export interface UpdateUserDTO {
  name?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}
