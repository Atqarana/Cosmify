'use client';
import React, { useEffect, useState } from 'react';
import { SignInButton, SignUpButton, useUser, useClerk, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from '../styles';
import { navVariants } from '../utils/motion';

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to home or any page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/dashboard'); // Redirect to dashboard after sign in
    }
  }, [isSignedIn, router]);

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="absolute w-[50%] inset-0 gradient-01" />
      <div className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}>
        <img src="/search.svg" alt="search" className="w-[24px] h-[24px] object-contain" />

        <h2 className="font-extrabold text-[24px] text-white leading-[30px]">
          COSMIFY✨
        </h2>

        {/* Authentication and User Profile */}
        <div className="hidden lg:flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <button
                onClick={handleSignOut}
                className="text-lg font-semibold py-2 px-4 navbutton text-white"
              >
                Sign Out
              </button>
              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton afterSignInUrl="/dashboard">
                <button className="text-lg font-semibold py-2 px-4 navbutton text-white">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton afterSignUpUrl="/dashboard">
                <button className="text-lg font-semibold py-2 px-4 navbutton text-white">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;