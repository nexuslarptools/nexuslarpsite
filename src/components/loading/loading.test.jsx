import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

// Mock the SVG import
vi.mock('../../assets/loading.svg', () => ({
  default: 'mocked-loading.svg'
}));

describe('Loading Component', () => {
  it('renders the loading component', () => {
    render(<Loading />);

    // Check if the loading container is in the document
    const loadingContainer = document.querySelector('.loading-container');
    expect(loadingContainer).toBeInTheDocument();

    // Check if the loading image is rendered with correct attributes
    const loadingImage = screen.getByAltText('Loading');
    expect(loadingImage).toBeInTheDocument();
    expect(loadingImage).toHaveClass('loaderpic');
    expect(loadingImage.src).toContain('mocked-loading.svg');
  });
});
