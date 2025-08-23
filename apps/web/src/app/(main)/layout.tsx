import Icon from '@/components/icon';
import '@/globals.css';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import type { PropsWithChildren } from 'react';
import LocaleSwitch from '@/components/locale-switch';
import ProfileButton from '@/components/profile-button';
import { Button } from '@/components/ui/button';
import { fontsVariables } from '@/lib/font';
import { cn } from '@/lib/utils';
import Providers from '@/providers';

export default async function RootLayout({ children }: PropsWithChildren) {
  const t = await getTranslations('home');
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={cn(fontsVariables, 'font-sans')}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="navbar bg-base-200">
              <header className="container flex justify-end py-2">
                <nav className="flex items-center gap-2">
                  <LocaleSwitch />
                  <ProfileButton />
                </nav>
              </header>
              <hr />
            </div>
            <main className="flex-1">{children}</main>
            <footer className="bg-base-200">
              <div className="container flex items-center justify-between p-4">
                <aside className="flex items-center gap-2">
                  <Button size="icon" variant="ghost">
                    <Icon name="common/logo" />
                  </Button>
                  <p>{t('copyright')}</p>
                </aside>
                <nav className="flex justify-self-center">
                  <Link
                    href="https://discord.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button size="icon" variant="ghost">
                      <Icon name="socials/discord" />
                    </Button>
                  </Link>
                  <Link
                    href="https://facebook.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button size="icon" variant="ghost">
                      <Icon name="socials/facebook" />
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button size="icon" variant="ghost">
                      <Icon name="socials/github" />
                    </Button>
                  </Link>
                  <Link
                    href="https://twitter.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button size="icon" variant="ghost">
                      <Icon name="socials/twitter" />
                    </Button>
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
