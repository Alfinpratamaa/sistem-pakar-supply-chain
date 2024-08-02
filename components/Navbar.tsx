'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const handleNav = () => {
        setNav(!nav);
    };

    const handleLogout = async () => {
        await signOut({
            redirect: false,
            callbackUrl: '/login',
        });
        router.push('/login');
    };

    const navItems = [
        { id: 1, text: 'Konsultasi', href: '/question' },
        { id: 2, text: 'History', href: '/history' },
    ];

    return (
        <div className="bg-transparent z-[1] flex justify-between items-center h-[70px] max-w-full mx-auto px-4 text-secondary-foreground">
            <Link href={'/'}>
                <h1 className="w-full text-3xl cursor-pointer font-bold ms-7 text-primary">SupChain</h1>
            </Link>

            <ul className="hidden md:flex items-center">
                {navItems.map((item) => (
                    <Link href={item.href} key={item.id}>
                        <li className="p-3 hover:bg-primary rounded-xl m-2 cursor-pointer duration-300 hover:text-primary-foreground">
                            {item.text}
                        </li>
                    </Link>
                ))}
                {status === 'authenticated' ? (
                    <Button onClick={handleLogout} variant="outline" className="m-2 border-primary border">Logout</Button>
                ) : (
                    <Link href={'/login'}>
                        <Button variant="secondary" className="m-2">Login</Button>
                    </Link>
                )}
            </ul>

            <div onClick={handleNav} className="block cursor-pointer md:hidden">
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-[60%] h-full bg-secondary ease-in-out duration-500 z-50'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                <Link href={'/'}>
                    <h1 className="w-full text-3xl font-bold text-primary m-4">SupChain</h1>
                </Link>
                {navItems.map((item) => (
                    <Link href={item.href} key={item.id}>
                        <li className="p-3 border-b rounded-xl mx-auto justify-center hover:bg-primary duration-300 hover:text-black cursor-pointer">
                            {item.text}
                        </li>
                    </Link>
                ))}
                {status === 'authenticated' ? (
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </Button>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
