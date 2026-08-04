import { redirect } from 'next/navigation'
import React from 'react'
import { getServerSession } from 'next-auth';
import LogoutBtn from '@/components/LogoutBtn';
import Link from 'next/link';
import { BookOpen, PlusCircle, UserCircle, Compass } from 'lucide-react';

const Dashboard = async() => {

    const session = await getServerSession()

    if(!session){
        redirect('/login')
    }

    return (
        <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Welcome Banner */}
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Author Workspace
                    </h1>
                    <p className="text-sm text-muted mt-2">
                        Welcome to your creative dashboard. Manage your catalog and start writing.
                    </p>
                </div>

                {/* Dashboard Shortcut Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Create Book Shortcut */}
                    <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                            <PlusCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Create New Book
                        </h2>
                        <p className="text-sm text-muted mt-2 mb-6">
                            Draft a new novel or documentation. Set metadata and structure your chapters.
                        </p>
                        <Link 
                            href="/dashboard/create-book"
                            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                            Get Started &rarr;
                        </Link>
                    </div>

                    {/* My Books Shortcut */}
                    <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <div className="h-12 w-12 rounded-2xl bg-violet-500/10 dark:bg-violet-500/25 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-5">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            My Publications
                        </h2>
                        <p className="text-sm text-muted mt-2 mb-6">
                            Manage your existing list of books. Edit content, upload covers, and track drafts.
                        </p>
                        <Link 
                            href="/dashboard/my-book"
                            className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                        >
                            Manage Books &rarr;
                        </Link>
                    </div>

                    {/* Profile Management Shortcut */}
                    <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Profile Settings
                        </h2>
                        <p className="text-sm text-muted mt-2 mb-6">
                            Update your custom author bio, change your avatar picture, and review statistics.
                        </p>
                        <Link 
                            href="/dashboard/profilePage/profile"
                            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                            View Profile &rarr;
                        </Link>
                    </div>

                    {/* Browse Library Shortcut */}
                    <div className="group bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-card-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
                            <Compass className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">
                            Browse Platform
                        </h2>
                        <p className="text-sm text-muted mt-2 mb-6">
                            Go back to the homepage to read books from other creators or search the library.
                        </p>
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                        >
                            Explore Books &rarr;
                        </Link>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-center border-t border-card-border pt-8">
                    <LogoutBtn />
                </div>
            </div>
        </div>
    )
}

export default Dashboard