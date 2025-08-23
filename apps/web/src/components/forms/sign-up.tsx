'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { signUp } from '@/lib/auth-client';

const schemaSignUp = z.object({
  email: z.string(), // .min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string(), // .min(6, { message: 'Password must be at least 6 characters long' }),
});

type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpForm = () => {
  const t = useTranslations();

  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(schemaSignUp),
  });

  const { control, handleSubmit, setError } = methods;

  const router = useRouter();

  const onSubmit = async ({ email, password }: SignUpSchema) => {
    const signUpResponse = await signUp.email({
      email,
      password,
      name: '',
      callbackURL: '/',
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });

    if (signUpResponse.error) {
      setError('root', {
        message: signUpResponse.error.message,
      });
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t('auth.signUp.title')}
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
                      <FormLabel>{t('common.password')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit">
                  {t('common.signUp')}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t('common.alreadyHaveAccount')}{' '}
                <Link
                  className="underline underline-offset-4"
                  href="/auth/sign-in"
                >
                  {t('common.login')}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
