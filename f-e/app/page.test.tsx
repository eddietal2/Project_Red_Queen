import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

// Mock Next.js Link and Image if needed
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />);
jest.mock('@/components/ui/button', () => ({ children, className }) => <button className={className}>{children}</button>);

describe('Home Component (Landing Page)', () => {
  beforeEach(() => {
    // Mock window.innerWidth for desktop (1024px+)
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    window.dispatchEvent(new Event('resize'));
  });

  test('renders hero section with title and button', () => {
    render(<Home />);
    
    expect(screen.getByText('Welcome to RedQueen.AI.')).toBeInTheDocument();
    expect(screen.getByText('AI Agent for discovering Resident Evil Lore.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start chat/i })).toBeInTheDocument();
  });

  test('renders features section with heading and cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('RAG-Powered Chatbot')).toBeInTheDocument();
    expect(screen.getByText('Decoupled Architecture')).toBeInTheDocument();
    expect(screen.getByText('Vector Database Integration')).toBeInTheDocument();
  });

  test('renders about section with heading and tech cards', () => {
    render(<Home />);
    
    expect(screen.getByText('About This Software')).toBeInTheDocument();
    expect(screen.getByText('NextJS')).toBeInTheDocument();
    expect(screen.getByText('Django')).toBeInTheDocument();
    expect(screen.getByText('Gemini 2.5 Flash')).toBeInTheDocument();
    expect(screen.getByText('Llama Index (for RAG)')).toBeInTheDocument();
    expect(screen.getByText('TailwindCSS & Shadcn')).toBeInTheDocument();
    expect(screen.getByText('ChromaDB')).toBeInTheDocument();
  });

  test('applies desktop-specific classes (e.g., grid layout)', () => {
    render(<Home />);
    
    // Check if features grid uses lg:grid-cols-3 (desktop)
    const featuresList = screen.getByRole('list', { name: /features/i });
    expect(featuresList).toHaveClass('grid-cols-1', 'md:grid-cols-3'); // Assuming Tailwind classes are applied
  });

  test('start chat button links to /chat', () => {
    render(<Home />);
    
    const button = screen.getByRole('link', { name: /start chat/i });
    expect(button).toHaveAttribute('href', '/chat');
  });
});