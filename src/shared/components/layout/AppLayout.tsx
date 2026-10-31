import { AppShell, Burger, Container, Group, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, NavLink, Outlet } from 'react-router';
import { useAppSelector } from '@/app/store/hooks';
import { NAV_ITEMS } from '@/shared/constants/navItems';
import { ROUTES } from '@/shared/constants/routes';
import { ColorSchemeToggle } from '../ui/ColorSchemeToggle';
import { Logo } from '../ui/Logo';
import classes from './AppLayout.module.css';
import { UserMenu } from './UserMenu';

/** Top bar only, no sidebar. On phones the links move into a menu. */
export const AppLayout = () => {
  const [menuOpened, { toggle, close }] = useDisclosure();
  const user = useAppSelector((state) => state.auth.user);
  const items = NAV_ITEMS.filter(
    (item) =>
      (!item.loggedIn || user) &&
      (!item.roles || (user && item.roles.includes(user.role))),
  );

  return (
    <AppShell header={{ height: 64 }} padding="lg">
      <AppShell.Header className={classes.header}>
        <Group h="100%" px="lg" justify="space-between" wrap="nowrap">
          <Link
            to={ROUTES.analyze}
            aria-label="npm-sentinel home"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Logo />
          </Link>

          <Group component="nav" aria-label="Main" gap={4} visibleFrom="sm">
            {items.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={classes.link}
              >
                {item.label}
              </NavLink>
            ))}
          </Group>

          <Group gap="xs" wrap="nowrap">
            <ColorSchemeToggle />
            <UserMenu />
            <Menu
              opened={menuOpened}
              onChange={toggle}
              position="bottom-end"
              width={200}
            >
              <Menu.Target>
                <Burger
                  opened={menuOpened}
                  hiddenFrom="sm"
                  size="sm"
                  aria-label="Open navigation"
                />
              </Menu.Target>
              <Menu.Dropdown>
                {items.map((item) => (
                  <Menu.Item
                    key={item.url}
                    component={Link}
                    to={item.url}
                    onClick={close}
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size={1120} px={0} py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
