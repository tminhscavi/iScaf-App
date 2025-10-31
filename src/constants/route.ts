import { MOBILE_NAVIGATION_MENU, PROFILE_NAVIGATION_MENU } from './navigation';

export const protectedRoutes = ['/profile'];
export const publicRoutes = ['/login', '/register'];
export const authRoutes = ['/login', '/register'];

export const NAVIGATION_ROUTES = [
  ...MOBILE_NAVIGATION_MENU,
  ...PROFILE_NAVIGATION_MENU,
];
