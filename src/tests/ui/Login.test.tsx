import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BankingLoginForm from '../../components/Auth/Login';
import { useAuth } from '@/contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext');

describe('BankingLoginForm Component', () => {
  let mockLogin: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
    });
  });

  test('renders the login form', () => {
    render(
      <Router>
        <BankingLoginForm />
      </Router>
    );

    expect(screen.getByText('Welcome to SecureBank')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('validates the form fields', async () => {
    render(
      <Router>
        <BankingLoginForm />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Account number is required')).toBeInTheDocument();
    });
  });

  test('calls login function on submit with valid data', async () => {
    render(
      <Router>
        <BankingLoginForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Account Number'), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password1!' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', '12345678901', 'Password1!');
    });
  });

  test('displays loading state when logging in', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      loading: true,
    });

    render(
      <Router>
        <BankingLoginForm />
      </Router>
    );

    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
  });
});