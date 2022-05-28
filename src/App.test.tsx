import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar title', () => {
  render(<App />);
  const navbarTitle = screen.getByText(/Prosimos/i);
  expect(navbarTitle).toBeInTheDocument();
});
