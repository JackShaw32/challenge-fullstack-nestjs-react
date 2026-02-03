import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Posts from './Posts';

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
  },
}));

vi.mock('@/api/client', () => ({ apiClient: mockApiClient }));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe('Posts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la lista de posts', async () => {
    const fakePosts = [
      { id: '1', title: 'Post 1', content: 'Content 1', created_at: new Date().toISOString() },
      { id: '2', title: 'Post 2', content: 'Content 2', created_at: new Date().toISOString() },
    ];
    mockApiClient.get.mockResolvedValueOnce(fakePosts);

    render(
      <BrowserRouter>
        <Posts />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje si no hay posts', async () => {
    mockApiClient.get.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <Posts />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No hay publicaciones aún.')).toBeInTheDocument();
    });
  });
});