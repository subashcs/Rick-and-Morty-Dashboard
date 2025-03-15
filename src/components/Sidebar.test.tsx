import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from '@/components/ui/provider';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';

const mockLogout = vi.fn();
const mockLogin = vi.fn();
const mockUser = { username: 'JohnDoe', isAuthenticated: true };

const renderWithProviders = (collapsed = false) => {
  return render(
    <AuthContext.Provider
      value={{ logout: mockLogout, login: mockLogin, user: mockUser }}
    >
      <Provider>
        <MemoryRouter>
          <Sidebar collapsed={collapsed} />
        </MemoryRouter>
      </Provider>
    </AuthContext.Provider>
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar with navigation links', () => {
    renderWithProviders();

    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
  });

  it('displays username for user profile menu', () => {
    renderWithProviders();

    expect(screen.getByText('JohnDoe')).toBeInTheDocument();
  });

  it('calls logout function when clicking logout button', () => {
    renderWithProviders();

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
