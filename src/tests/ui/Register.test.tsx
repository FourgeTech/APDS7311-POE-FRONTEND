import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../components/Auth/Register';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext');

describe('Register', () => {
  let mockRegister: jest.Mock;

  beforeEach(() => {
    mockRegister = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
  });

  test('renders the form fields', () => {
    render(<Register />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/id number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('validates the form fields', async () => {
    render(<Register />);

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/id number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/account number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('calls register function on submit with valid data', async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/id number/i), { target: { value: '1234567890123' } });
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        IDNumber: '1234567890123',
        accountNumber: '12345678901',
        password: 'Password1!',
      });
    });
  });

  test('displays loading state when registering', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: true,
    });

    render(<Register />);

    expect(screen.getByRole('button', { name: /registering/i })).toBeInTheDocument();
  });
});