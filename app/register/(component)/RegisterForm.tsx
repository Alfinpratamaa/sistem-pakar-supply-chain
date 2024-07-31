'use client'

import * as React from 'react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const router = useRouter();
    const [data, setData] = useState({ username: "", email: "", password: "" });

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form data using Zod
        const validationResult = registerSchema.safeParse(data);
        if (!validationResult.success) {
            const fieldErrors: Record<string, string> = {};
            validationResult.error.errors.forEach((error) => {
                fieldErrors[error.path[0]] = error.message;
            });
            setErrors(fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setIsLoading(false);
                router.push('/');
            } else {
                setIsLoading(false);
                alert('Registration failed.');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleRegister}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="cursor-pointer" htmlFor="username">
                            Username
                        </Label>
                        <Input
                            id="username"
                            placeholder="user123"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={data.username}
                            onChange={(e) => setData({ ...data, username: e.target.value })}
                        />
                        {errors.username && <p className="text-red-500">{errors.username}</p>}
                    </div>
                    <div className="grid gap-1">
                        <Label className="cursor-pointer" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div className="grid gap-1">
                        <Label className="cursor-pointer" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="********"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign Up
                    </Button>
                    <p className='text-sm mt-2'>Already have an account ? <span className="text-primary hover:underline"><Link href={"/login"}>Login</Link></span></p>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" onClick={
                async () => await signIn('google', { callbackUrl: '/', redirect: false })
            } >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
            </Button>
        </div>
    )
}
