import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PostDetail from './PostDetail';

const { mockApiClient, mockNavigate } = vi.hoisted(() => {
  return {
    mockApiClient: {
      get: vi.fn(),
      delete: vi.fn(),
    },
    mockNavigate: vi.fn(),
  };
});

vi.mock('@/api/client', () => ({ apiClient: mockApiClient }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user1', name: 'Test User' },
  }),
}));

describe('PostDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPost = {
    id: '123',
    title: 'Título de Prueba',
    content: 'Contenido del post',
    created_at: new Date().toISOString(),
    user: { id: 'user1', name: 'Author', avatarUrl: '' },
  };

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PostDetail />
      </BrowserRouter>
    );
  };

  it('debe mostrar la publicación correctamente', async () => {
    mockApiClient.get.mockResolvedValueOnce(mockPost);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Título de Prueba')).toBeInTheDocument();
      expect(screen.getByText('Contenido del post')).toBeInTheDocument();
    });
  });

  it('debe mostrar botones de editar/eliminar si soy el dueño', async () => {
    mockApiClient.get.mockResolvedValueOnce(mockPost);
    renderComponent();

    await waitFor(() => {
       const buttons = screen.getAllByRole('button');
       expect(buttons.length).toBeGreaterThan(1);
    });
  });

  it('debe mostrar error si falla la carga', async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error('Error'));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Publicación no encontrada')).toBeInTheDocument();
    });
  });
});