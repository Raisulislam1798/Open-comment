'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Home Link */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Open comment
        </Link>

        {/* Conditional Auth Section */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="text-sm text-slate-400">Loading...</span>
          ) : session?.user ? (
            <>
              {/* Logged-in User Name */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium">
                <FiUser className="w-4 h-4 text-indigo-600" />
                <span>{session.user.name}</span>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              {/* Sign In Button */}
              <Link
                href="/singup"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              

              {/* Log In Button */}
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;