'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BookList from '@/components/BookList';
import SavedBooksSection from '@/components/Savedbookssection';
import { User, Mail, Calendar, Edit3, BookOpen, Layers } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("Please login first");
      router.push("/");
    }
  }, [status, router]);

  const [data, setData] = useState<any>([])

  const [stats, setStats] = useState({
    totalBooks: 0,
    publishedBooks: 0,
    draftBooks: 0,
    totalChapters: 0,
  })

  useEffect(() => {
    if (!session) return;
    const profileData = async () => {
      try {
        const res = await axios.get("/api/profile")
        console.log(res.data);
        setData(res.data.profile)
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    }
    profileData();
  }, [session])

  useEffect(() => {
    if (!session) return;
    const statData = async () => {
      try {
        const res = await axios.get("/api/profile/statistics")
        console.log(res.data);
        setStats(res.data)
      } catch (error) {
        console.log("Error fetching stats", error);
      }
    }
    statData()
  }, [session])

  if (status === "loading") {
    return <div className="p-6 text-center text-sm font-semibold">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-900/60 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* User Profile Card */}
        <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
          
          {/* Avatar Picture */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/20 shadow-inner overflow-hidden flex-shrink-0 flex items-center justify-center">
            {data.avatar ? (
              <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-indigo-500 opacity-60" />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {data.fullname || data.username || "Book Author"}
                </h1>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  @{data.username}
                </p>
              </div>
              <Link 
                href="/dashboard/profilePage/profileUpdate"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground rounded-xl shadow-sm transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 mt-4 text-xs font-semibold text-muted">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                {data.email}
              </span>
              {data.join && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Joined {new Date(data.join).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>

            {data.bio && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed max-w-2xl italic">
                "{data.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Activity Stats Block */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
            Activity Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-card-border p-5 text-center shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">{stats.totalBooks}</h3>
              <p className="text-xs font-bold text-muted uppercase mt-1 tracking-wider">Total Books</p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-card-border p-5 text-center shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">{stats.publishedBooks}</h3>
              <p className="text-xs font-bold text-muted uppercase mt-1 tracking-wider">Published</p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-card-border p-5 text-center shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-450 mx-auto mb-3">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">{stats.draftBooks}</h3>
              <p className="text-xs font-bold text-muted uppercase mt-1 tracking-wider">Drafts</p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-card-border p-5 text-center shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-3">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-3xl font-extrabold text-foreground">{stats.totalChapters}</h3>
              <p className="text-xs font-bold text-muted uppercase mt-1 tracking-wider">Chapters</p>
            </div>
          </div>
        </div>

        {/* Book lists */}
        <div className="border-t border-card-border pt-10 flex flex-col gap-10">
          <div>
            <BookList />
          </div>
          <div>
            <SavedBooksSection />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile