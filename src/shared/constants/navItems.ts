import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  url: string;
}

/** Links in the top bar, in order. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Analyze', url: ROUTES.analyze },
  { label: 'Scans', url: ROUTES.scans },
  { label: 'Users', url: ROUTES.users },
];
