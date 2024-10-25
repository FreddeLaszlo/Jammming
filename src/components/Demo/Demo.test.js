import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect, jest, test } from '@jest/globals';
import Demo from './Demo';


describe('Renders DEMO, or not', () => {
  it('should not render DEMO when isDemo = false', () => {
    // ARRANGE
    // ACT
    const { container } = render(<Demo isDemo={false} />);
    // ASSERT
    expect(container).toBeEmptyDOMElement();
  });

  it('should render DEMO when isDemo = true', () => {
    // ARRANGE
    // ACT
    const { container } = render(<Demo isDemo={true} />);
    // ASSERT
    expect(container.innerHTML).toBe('<div class="demo">DEMO</div>');
  });

  it('should render DEMO when isDemo prop is not provided', () => {
    // ARRANGE
    // ACT
    const { container } = render(<Demo />);
    // ASSERT
    expect(container.innerHTML).toBe('<div class="demo">DEMO</div>');
  });
});
