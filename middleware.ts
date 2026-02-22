import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // Adjust path if needed

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(gu|hi|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};