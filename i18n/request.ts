import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Await the locale promise (Next.js 16 requirement)
  let locale = await requestLocale as 'en' | 'gu' | 'hi';

  // 2. Validate the locale, fallback to default if invalid/undefined
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // 3. Load the corresponding dictionary
    messages: (await import(`../messages/${locale}.json`)).default
  };
});