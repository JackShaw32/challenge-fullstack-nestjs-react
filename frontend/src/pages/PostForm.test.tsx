import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PostForm from './PostForm';

const { mockApiClient, mockNavigate } = vi.hoisted(() => ({
  mockApiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
  mockNavigate: vi.fn(),
}));

vi.mock('@/api/client', () => ({ apiClient: mockApiClient }));

let mockParams = {}; 

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user1' },
    isAuthenticated: true,
  }),
}));

describe('PostForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = {}; 
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PostForm />
      </BrowserRouter>
    );
  };

  it('Modo CREAR: debe enviar datos al endpoint POST', async () => {
    mockApiClient.post.mockResolvedValueOnce({ id: 'new-id' });
    renderComponent();

    expect(screen.getByText('Nueva Publicación')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nuevo Post' } });
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Contenido nuevo' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Publicar/i }));

    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith('/posts', {
        title: 'Nuevo Post',
        content: 'Contenido nuevo',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/posts/new-id');
    });
  });

  it('Modo EDITAR: debe cargar datos y enviar PUT', async () => {
    mockParams = { id: '123' }; 
    mockApiClient.get.mockResolvedValueOnce({ 
      id: '123', title: 'Post Viejo', content: 'Contenido Viejo' 
    });
    mockApiClient.put.mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Post Viejo')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Post Editado' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar Cambios/i }));

    await waitFor(() => {
      expect(mockApiClient.put).toHaveBeenCalledWith('/posts/123', {
        title: 'Post Editado',
        content: 'Contenido Viejo',
      });
    });
  });
});