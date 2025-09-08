import { RoleEnum } from '@core/auth/data-access/auth.model';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
  isMenu: boolean;
  children?: SidebarItem[];
  allowedRoles?: number[];
  menuVisible?: boolean;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'home',
    icon: 'fa-house',
    link: '/app/home',
    isMenu: false,
    allowedRoles: [RoleEnum.Admin],
  },
  {
    label: 'ideas',
    icon: 'fa-list-check',
    link: '/app/ideas/list',
    isMenu: false,
    allowedRoles: [RoleEnum.All],
  },
];
