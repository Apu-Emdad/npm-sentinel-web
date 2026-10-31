import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderRoutes } from '@/test/utils';
import { routes } from './router';

describe('router', () => {
  it('shows the top bar with the main links', () => {
    renderRoutes(routes, '/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const label of ['Analyze', 'Scans', 'Users']) {
      expect(nav).toHaveTextContent(label);
    }
    expect(
      screen.getByRole('heading', {
        name: 'Check a package before you install it',
      }),
    ).toBeInTheDocument();
  });

  it('marks the link of the current page', async () => {
    const { router } = renderRoutes(routes, '/');

    await userEvent.click(screen.getByRole('link', { name: 'Scans' }));

    expect(router.state.location.pathname).toBe('/scans');
    expect(screen.getByRole('link', { name: 'Scans' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Analyze' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('shows the not-found page for unknown paths', () => {
    renderRoutes(routes, '/nope');

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Analyze a package' }),
    ).toHaveAttribute('href', '/');
  });
});
