import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BankingLoginForm from '../../components/Auth/Login';
import { useAuth } from '@/contexts/AuthContext';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext');

describe('BankingLoginForm', () => {
  let mockLogin: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  test('renders the form fields', () => {
    render(<BankingLoginForm/>);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
  });

  test('validates the form fields', async () => {
    render(<BankingLoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/account number is required/i)).toBeInTheDocument();
    });
  });

  test('calls login function on submit with valid data', async () => {
    render(<BankingLoginForm />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '12345678901' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', '12345678901', 'Password1!');
    });
  });

  test('displays loading state when logging in', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
    });

    render(<BankingLoginForm />);

    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });
});