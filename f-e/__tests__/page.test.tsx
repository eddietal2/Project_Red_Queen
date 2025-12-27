import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { describe, beforeEach, it, expect } from 'vitest';

describe('Landing Page', () => {
  beforeEach(() => {
    render(<Home />);
  });

  describe('Hero Section', () => {
    it('renders the hero section', () => {
      const heroSection = screen.getByRole('banner'); // Assuming semantic role
      expect(heroSection).toBeInTheDocument();
    });

    it('renders the chat button CTA', () => {
      const chatButton = screen.getByRole('button', { name: /chat/i });
      expect(chatButton).toBeInTheDocument();
    });

    it('renders the main heading in hero', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('renders a subtitle or description in hero', () => {
      const subtitle = screen.getByText(/welcome|description/i);
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('renders the features section', () => {
      const featuresSection = screen.getByRole('region', { name: /features/i });
      expect(featuresSection).toBeInTheDocument();
    });

    it('renders at least one feature item', () => {
      const featureItems = screen.getAllByRole('listitem');
      expect(featureItems.length).toBeGreaterThan(0);
    });

    it('renders feature headings', () => {
      const featureHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(featureHeadings.length).toBeGreaterThan(0);
    });

    it('renders feature descriptions', () => {
      const descriptions = screen.getAllByText(/AI|system|leverage/i);
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('About this Software Section', () => {
    it('renders the about section', () => {
      const aboutSection = screen.getByRole('region', { name: /about/i });
      expect(aboutSection).toBeInTheDocument();
    });

    it('renders about content text', () => {
      const aboutText = screen.getByText(/about|software/i);
      expect(aboutText).toBeInTheDocument();
    });
  })

  describe('Mobile Responsiveness', () => {
    it('renders responsive text sizes in hero section', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl', 'lg:text-4xl');
    });

    it('renders responsive button sizing', () => {
      const chatButton = screen.getByRole('button', { name: /chat/i });
      expect(chatButton).toHaveClass('px-6', 'py-3', 'sm:px-8', 'sm:py-4');
    });

    it('renders responsive grid layouts in features section', () => {
      const featuresGrid = screen.getByRole('region', { name: /features/i }).querySelector('ul');
      expect(featuresGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });

    it('renders responsive padding in features section', () => {
      const featuresSection = screen.getByRole('region', { name: /features/i });
      expect(featuresSection).toHaveClass('py-8', 'sm:py-12', 'lg:py-16', 'px-4');
    });

    it('renders responsive icon sizes in features', () => {
      const icons = screen.getAllByRole('img', { hidden: true });
      // Check that at least one icon has responsive classes
      const hasResponsiveIcon = icons.some(icon =>
        icon.className.includes('w-8') &&
        icon.className.includes('h-8') &&
        icon.className.includes('sm:w-10') &&
        icon.className.includes('sm:h-10')
      );
      expect(hasResponsiveIcon).toBe(true);
    });

    it('renders touch-friendly button sizes', () => {
      const chatButton = screen.getByRole('button', { name: /chat/i });
      // Check for minimum touch target size (44px)
      const hasMinTouchTarget = chatButton.className.includes('py-3') || chatButton.className.includes('py-4');
      expect(hasMinTouchTarget).toBe(true);
    });

    it('renders responsive text sizes in about section', () => {
      const aboutHeading = screen.getByRole('heading', { name: /about/i });
      expect(aboutHeading).toHaveClass('text-2xl', 'sm:text-3xl');
    });
  })
});