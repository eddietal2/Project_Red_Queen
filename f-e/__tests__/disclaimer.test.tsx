import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Disclaimer from '../app/disclaimer/page';
import { describe, beforeEach, it, expect, vi } from 'vitest';

// Mock next/navigation
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="alert-triangle-icon" />
  ),
  X: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="x-icon" />
  ),
}));

describe('Disclaimer Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the disclaimer page', () => {
      render(<Disclaimer />);
      expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    });

    it('renders the alert triangle icon', () => {
      render(<Disclaimer />);
      const icon = screen.getByTestId('alert-triangle-icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders the main disclaimer text', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/All fictional lore, characters, names/)).toBeInTheDocument();
    });

    it('renders the copyright notice', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it('renders the Capcom reference', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/Capcom Co., Ltd./)).toBeInTheDocument();
    });

    it('renders the educational use statement', () => {
      render(<Disclaimer />);
      expect(screen.getByText('This is for educational use only.')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('renders the close button', () => {
      render(<Disclaimer />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('renders the X icon in the close button', () => {
      render(<Disclaimer />);
      const xIcon = screen.getByTestId('x-icon');
      expect(xIcon).toBeInTheDocument();
    });

    it('calls router.back when close button is clicked', () => {
      render(<Disclaimer />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Layout', () => {
    it('has proper semantic structure', () => {
      render(<Disclaimer />);
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Disclaimer');
    });

    it('applies backdrop blur effect', () => {
      render(<Disclaimer />);
      const container = document.querySelector('.min-h-screen');
      expect(container).toHaveClass('backdrop-blur-lg');
    });

    it('has responsive padding', () => {
      render(<Disclaimer />);
      const card = screen.getByText('Disclaimer').closest('.rounded-lg');
      expect(card).toHaveClass('p-8', 'md:p-12');
    });
  });

  describe('Content Sections', () => {
    it('displays intellectual property disclaimer', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/fictional lore, characters, names/)).toBeInTheDocument();
      expect(screen.getByText(/"Red Queen," "Umbrella"/)).toBeInTheDocument();
    });

    it('displays affiliation disclaimer', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/not affiliated with, endorsed by, or sponsored by Capcom/)).toBeInTheDocument();
    });

    it('displays ownership disclaimer', () => {
      render(<Disclaimer />);
      expect(screen.getByText(/No claim of ownership is made over the source materials/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Disclaimer />);
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Disclaimer');
    });

    it('has descriptive text for screen readers', () => {
      render(<Disclaimer />);
      // The component should have proper text content for screen readers
      expect(screen.getByText(/commentary, criticism, and transformative educational purposes/)).toBeInTheDocument();
    });
  });
});