'use client';;
import './LoginPage.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Form } from './(component)/Form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const RegisterPage = () => {

    const router = useRouter();

    const [login, setLogin] = useState({ email: "", password: "" });
    const [resgister, setRegister] = useState({ username: "", email: "", password: "" });

    const handleRegister = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resgister)
            });

            if (response.ok) {
                alert('Registration successful! Please log in.');
            } else {
                alert('Registration failed.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const response = await signIn('credentials', {
            ...login,
            redirect: false,
            callbackUrl: '/'
        });

        if (response?.error) {
            alert('Invalid email or password.');
        } else {
            router.push('/');
        }
    };


    return (

        <>
            <div className="container relative hidden h-[800px]  flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="/login"
                    className={cn(
                        "absolute right-4 top-4 md:right-8 md:top-2"
                    )}
                >
                    <Button variant={"ghost"}>
                        Login
                    </Button>
                </Link>
                <div className="relative hidden h-full flex-col bg-white p-5 text-white dark:border-r lg:flex ">
                    <div className="relative w-3/4 h-2/4 mt-10 max-w-md mx-auto max-h-md">
                        <Image
                            src={"/images/signup.jpg"}
                            alt={'background'}
                            layout="fill"
                            objectFit="cover"
                            className='rounded-lg'
                        />
                    </div>
                </div>
                <div className="lg:p-3 mt-16 me-20">
                    <div className="mx-auto flex w-full flex-col  space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Create an account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email below to create your account
                            </p>
                        </div>
                        <Form />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking <span className='text-primary font-semibold'>Sign Up</span>, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>





        // jangan dihapus
        // <div className="main">
        //     <input type="checkbox" id="chk" aria-hidden="true" />

        //     <div className="signup">
        //         <form onSubmit={handleRegister}>
        //             <label htmlFor="chk" aria-hidden="true">Sign up</label>
        //             <input
        //                 type="text"
        //                 value={resgister.username}
        //                 onChange={(e) => setRegister({
        //                     ...resgister,
        //                     username: e.target.value
        //                 })}
        //                 name="txt"
        //                 placeholder="User name"
        //                 required />
        //             <input type="email" value={resgister.email}
        //                 onChange={(e) => setRegister({
        //                     ...resgister,
        //                     email: e.target.value
        //                 })}
        //                 name="email" placeholder="Email" required />
        //             <input type="password" value={resgister.password}
        //                 onChange={(e) => setRegister({
        //                     ...resgister,
        //                     password: e.target.value
        //                 })} name="pswd" placeholder="Password" required />
        //             <button type="submit">Sign up</button>
        //         </form>
        //     </div>

        //     <div className="login">
        //         <form onSubmit={handleLogin}>
        //             <label htmlFor="chk" aria-hidden="true">Login</label>
        //             <input type="email" name="email" value={login.email} onChange={(e) => setLogin({
        //                 ...login,
        //                 email: e.target.value,
        //             })} placeholder="Email" required />
        //             <input type="password" name="pswd" value={login.password} onChange={(e) => setLogin({
        //                 ...login,
        //                 password: e.target.value,
        //             })} placeholder="Password" required />
        //             <button type="submit">Login</button>
        //         </form>
        //     </div>
        // </div>
    );
};

export default RegisterPage;
