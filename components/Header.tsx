"use client";
import Link from 'next/link';
import React from 'react';
import Image from 'next/image'; 
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { FolderOpen, PenBox } from 'lucide-react';
import UserMenu from './user-menu';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-lg border-b border-orange-200 shadow-sm">
            
            <div className="px-6 py-2 flex justify-between items-center">
                
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image 
                        src="/Logo.png"
                        alt="MoodScript Logo"
                        width={420}
                        height={48}
                        className="h-12 w-auto object-contain" 
                    />
                </Link>
                
                {/* Auth Buttons */}
                <div className="flex items-center gap-4 justify-center">
                    <SignedIn>
                        <Link href="/dashboard#collections">
                        <Button variant="outline" className="flex items-center gap-2">
                            <FolderOpen size={18} />
                            <span className="hidden md:inline">Collections</span>
                        </Button>
                        </Link>
                    </SignedIn>

                    <Link href="/journal/write">
                        <Button variant="journal" className="flex items-center gap-2">
                        <PenBox size={18} />
                        <span className="hidden md:inline">Write New</span>
                        </Button>
                    </Link>   

                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard"><Button variant="outline" className="font-bold">Login</Button></SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserMenu />
                    </SignedIn>                
                </div>
            </div>
        </header>        
    ); 
};

export default Header;
