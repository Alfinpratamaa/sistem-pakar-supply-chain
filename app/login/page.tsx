import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { LoginForm } from './(component)/LoginForm';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

const LoginPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/');
    }

    return (
        <>
            <div className="container flex flex-col md:flex-row justify-center h-screen md:h-[800px] lg:max-w-none lg:px-0">

                <div className="hidden md:flex flex-col h-full bg-white p-5 text-white dark:border-r md:w-1/2 lg:w-2/5">
                    <div className="relative w-full h-[300px] mt-20 max-w-lg mx-auto ml-20 ">
                        <Image
                            src={"/images/signup.jpg"}
                            alt={'background'}
                            layout="fill"
                            objectFit="cover"
                            className='rounded-lg'
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-3/5 p-5 mt-5 md:mt-16">
                    <div className="mx-auto flex flex-col space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Welcome Back 😊
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Login to your account
                            </p>
                        </div>
                        <LoginForm />
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
    );
};

export default LoginPage;
