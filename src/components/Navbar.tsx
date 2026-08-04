'use client'

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutBtn from "./LogoutBtn";

const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="sticky top-0 z-50 glass border-b border-card-border backdrop-blur-md px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 transform group-hover:scale-105 transition-transform duration-300">
                            L
                        </span>
                        <p className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            LuminaBook
                        </p>
                    </Link>

                    <Link href="/" className="text-sm font-semibold text-muted hover:text-foreground transition-colors duration-200">
                        Home
                    </Link>
                    <Link 
                        href="/dashboard/profilePage/profile"
                        onClick={(e) => {
                            if (!session) {
                                e.preventDefault();
                                alert("Please login first");
                            }
                        }}
                        className="text-sm font-semibold text-muted hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
                    >
                        Profile
                    </Link>
                </div>

                <div className="flex items-center gap-5">
                    {status === "authenticated" ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-card-border">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-xs font-medium text-muted">
                                    {session.user?.email}
                                </p>
                            </div>

                            <LogoutBtn />
                        </>
                    ) : (
                        <Link 
                            href="/login"
                            className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;