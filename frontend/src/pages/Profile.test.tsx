import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('@/api/client', () => ({ apiClient: mockApiClient }));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user1' },
    updateUser: vi.fn(),
  }),
}));

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  it('debe mostrar la información del usuario', async () => {
    mockApiClient.get.mockImplementation((url) => {
      if (url.includes('/users/')) return Promise.resolve({ id: 'user1', name: 'Pepe', email: 'pepe@test.com' });
      if (url.includes('/posts')) return Promise.resolve([]); 
      return Promise.reject(new Error('not found'));
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pepe')).toBeInTheDocument();
      expect(screen.getByText('pepe@test.com')).toBeInTheDocument();
    });
  });

  it('debe activar modo edición al hacer click en Editar', async () => {
    mockApiClient.get.mockImplementation((url) => {
      if (url.includes('/users/')) return Promise.resolve({ id: 'user1', name: 'Pepe' });
      return Promise.resolve([]); 
    });

    renderComponent();

    await waitFor(() => {
        expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar Perfil'));
    
    await waitFor(() => {
       expect(screen.getByDisplayValue('Pepe')).toBeInTheDocument();
    });
  });
});