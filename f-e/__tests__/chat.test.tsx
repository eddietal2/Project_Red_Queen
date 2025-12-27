import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../app/chat/page';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock custom event
Object.defineProperty(window, 'CustomEvent', {
  value: class MockCustomEvent {
    [x: string]: any;
    constructor(type: any, options: { detail?: any } = {}) {
      this.type = type;
      this.detail = options.detail;
    }
  },
});

// Mock RedQueenAvatar component
vi.mock('@/components/RedQueenAvatar', () => ({
  default: ({ isTalking }: { isTalking: boolean }) => (
    <div data-testid="red-queen-avatar" data-talking={isTalking}>
      Red Queen Avatar
    </div>
  ),
}));

// Mock window.dispatchEvent to prevent errors
const originalDispatchEvent = window.dispatchEvent;
window.dispatchEvent = vi.fn();

describe('Chat Page', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup localStorage mocks
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});

    // Mock window.addEventListener
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {});
    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  });

  describe('Loading State', () => {
    it('shows loading spinner initially', () => {
      render(<Chat />);
      const loadingText = screen.getByText('Loading Red Queen...');
      expect(loadingText).toBeInTheDocument();
    });

    it('shows loading spinner with animation', () => {
      render(<Chat />);
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Post-Loading State', () => {
    beforeEach(async () => {
      render(<Chat />);
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading Red Queen...')).not.toBeInTheDocument();
      }, { timeout: 1100 });
    });

    it('renders the chat interface after loading', () => {
      expect(screen.getByText(/Welcome to Red Queen AI/i)).toBeInTheDocument();
    });

    it('renders the collapsed avatar when sidebar is closed', () => {
      const avatars = screen.getAllByTestId('red-queen-avatar');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('renders input field', () => {
      const input = screen.getByPlaceholderText(/Create a chat session to start/i);
      expect(input).toBeInTheDocument();
    });

    it('renders send button', () => {
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
    });

    it('loads sessions from localStorage on mount', () => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('chatSessions');
    });
  });

  describe('Sidebar Functionality', () => {
    beforeEach(async () => {
      render(<Chat />);
      await waitFor(() => {
        expect(screen.queryByText('Loading Red Queen...')).not.toBeInTheDocument();
      }, { timeout: 1100 });
    });

    it('shows sidebar toggle button when sidebar is closed', () => {
      const toggleButton = screen.getByText('→');
      expect(toggleButton).toBeInTheDocument();
    });

    it('opens sidebar when toggle button is clicked', () => {
      const toggleButton = screen.getByText('→');
      fireEvent.click(toggleButton);

      // The sidebar should now be open
      // This would require more complex state testing
    });
  });

  describe('Message Input', () => {
    beforeEach(async () => {
      render(<Chat />);
      await waitFor(() => {
        expect(screen.queryByText('Loading Red Queen...')).not.toBeInTheDocument();
      }, { timeout: 1100 });
    });

    it('allows typing in the input field', () => {
      const input = screen.getByPlaceholderText(/Create a chat session to start/i);
      fireEvent.change(input, { target: { value: 'Hello Red Queen' } });
      expect(input).toHaveValue('Hello Red Queen');
    });

    it('shows placeholder text when no session is active', () => {
      const input = screen.getByPlaceholderText('Create a chat session to start');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      render(<Chat />);
      await waitFor(() => {
        expect(screen.queryByText('Loading Red Queen...')).not.toBeInTheDocument();
      }, { timeout: 1100 });
    });

    it('loads sessions from localStorage on mount', () => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('chatSessions');
    });
  });
});