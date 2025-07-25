'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image'; // ✅ needed for logo
import Logo from '@/public/hirescanlogo.png'

interface NavbarProps {
    session: Session | null;
}

function getInitials(name: string) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export default function Navbar({ session }: NavbarProps) {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-purple-100 border-b border-purple-200 shadow-sm">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-purple-600">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 bg-purple-100 text-purple-700">
                        <div className="flex flex-col gap-4 mt-6">
                            <Link href="/dashboard/jobs" className="text-lg font-medium hover:text-purple-600">
                                Jobs
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/dashboard" className="flex items-center text-purple-700">
                    {/* <div className="w-12 h-12 md:w-14 md:h-14 relative">
                        <Image
                            src={Logo}
                            alt="HireScan Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div> */}
                    <span className="text-xl font-bold hidden md:block">HireScan</span>
                </Link>



                <div className="hidden md:flex gap-6">
                    <Link
                        href="/dashboard/jobs"
                        className="text-sm font-medium hover:underline text-purple-600"
                    >
                        Jobs
                    </Link>
                </div>
            </div>

            {session?.user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer bg-purple-600">
                            {session.user.image ? (
                                <AvatarImage src={session.user.image} alt="User avatar" />
                            ) : (
                                <AvatarFallback className="text-white font-semibold bg-purple-700">
                                    {getInitials(session.user.name || '')}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-purple-200 bg-purple-100 text-purple-700">
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile" className="hover:text-purple-600">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/company-details" className="hover:text-purple-600">Company Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="hover:text-purple-600">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()} className="hover:text-purple-600 cursor-pointer">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </nav>
    );
}
