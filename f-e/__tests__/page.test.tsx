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

    it('renders the hero image if present', () => {
      const image = screen.getByRole('img', { name: /hero/i });
      expect(image).toBeInTheDocument();
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
      const descriptions = screen.getAllByText(/feature|benefit/i);
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

    it('renders a link or button in about section', () => {
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });
});