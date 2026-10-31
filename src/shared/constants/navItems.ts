import { ROLE, type RoleName } from './roles';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  url: string;
  /** Hidden from guests. */
  loggedIn?: boolean;
  /** Shown only to these roles. This only hides the link: the API guards the routes. */
  roles?: RoleName[];
}

/** Links in the top bar, in order. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Analyze', url: ROUTES.analyze },
  { label: 'Scans', url: ROUTES.scans, loggedIn: true },
  { label: 'Users', url: ROUTES.users, roles: [ROLE.SUPER_ADMIN] },
];
