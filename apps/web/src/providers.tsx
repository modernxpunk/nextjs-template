import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { formats } from '@/lib/i18n/config';
import QueryWrapper from '@/query-provider';

const Providers = async ({ children }: PropsWithChildren) => {
  const messages = await getMessages();

  return (
    <QueryWrapper>
      <NextIntlClientProvider formats={formats} messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          themes={['light', 'dark']}
        >
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryWrapper>
  );
};

export default Providers;
