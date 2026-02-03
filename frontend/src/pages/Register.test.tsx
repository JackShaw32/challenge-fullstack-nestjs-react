import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

const mockRegister = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('debe renderizar el formulario correctamente', () => {
    renderComponent();
    expect(screen.getByText('Crear Cuenta', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
  });

  it('debe validar que las contraseñas coincidan', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: '123457' } });
    const form = screen.getByRole('button', { name: /Crear Cuenta/i }).closest('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    });
    
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debe llamar a register y navegar al home si todo es correcto', async () => {
    mockRegister.mockResolvedValueOnce(true);
    renderComponent();
    fireEvent.change(screen.getByLabelText(/^Nombre/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: '123456' } });
    const form = screen.getByRole('button', { name: /Crear Cuenta/i }).closest('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@email.com',
        password: '123456',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});