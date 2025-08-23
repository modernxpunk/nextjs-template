'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';

const schemaSignIn = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 8 characters long' }),
});

type SignInSchema = z.infer<typeof schemaSignIn>;

const SignInForm = () => {
  const t = useTranslations();

  const methods = useForm<SignInSchema>({
    resolver: zodResolver(schemaSignIn),
  });

  const { handleSubmit, control, setError } = methods;

  const onSubmit = async ({ email, password }: SignInSchema) => {
    const signInResponse = await signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: '/',
    });
    if (signInResponse.error) {
      setError('root', {
        message: signInResponse.error.message,
      });
    }
  };

  const signInGoogle = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('common.login')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="m@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>{t('common.password')}</span>
                        <Link
                          className="hover:underline hover:underline-offset-4"
                          href="/auth/forgot-password"
                        >
                          {t('common.forgotPassword')}
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit">
                  {t('common.login')}
                </Button>
                <FormMessage className="text-red-500 text-sm" />

                <Button
                  className="w-full"
                  onClick={signInGoogle}
                  type="button"
                  variant="outline"
                >
                  {t('common.loginWithGoogle')}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t('common.dontHaveAccount')}{' '}
                <Link
                  className="underline underline-offset-4"
                  href="/auth/sign-up"
                >
                  {t('common.signUp')}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
