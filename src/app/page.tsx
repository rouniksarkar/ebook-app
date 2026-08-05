'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import Pagination from "@/components/Pagination";
import { Eye, Heart, Search, Sparkles, BookOpen, User, FolderOpen } from "lucide-react";
import { useSession } from "next-auth/react";


type SortBy = "latest" | "mostViewed" | "mostLiked";
 
const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Latest", value: "latest" },
  { label: "Most Viewed", value: "mostViewed" },
  { label: "Most Liked", value: "mostLiked" },
];

export default function Home() {
  const { data: session } = useSession();

  const [books, setBooks] = useState([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/books/categories`);
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);
 
  // refetch books whenever page, sort, or category changes
  useEffect(() => {
    const fetchBook = async () => {
      const res = await axios.get(`/api/books/showBook`, {
        params: { page, limit: 6, sortBy, category },
      });
      setBooks(Array.isArray(res.data.books) ? res.data.books : [])
      setTotalPages(res.data.totalPages ?? 1);
    }
    fetchBook()
  }, [page, sortBy, category])
 
  // changing a filter should reset back to page 1
  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
    setPage(1);
  };
 
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const filteredBooks = useMemo(() => {
    if (!query.trim()) return books ?? [];

    const q = query.toLowerCase().trim();

    return (books ?? []).filter((book: any) => {
      const name = book.name?.toLowerCase() || "";
      const subtitle = book.subtitle?.toLowerCase() || "";
      const description = book.description?.toLowerCase() || "";
      const category = book.category?.toLowerCase() || "";
      const author = book.author?.username?.toLowerCase() || "";

      return (
        name.includes(q) ||
        subtitle.includes(q) ||
        description.includes(q) ||
        category.includes(q) ||
        author.includes(q)
      );
    });
  }, [query, books]);

  return (
    <div className="flex-1 pb-16 bg-linear-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-6 mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_45%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(167,139,250,0.15),transparent_40%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Discovery Library
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-linear-to-r from-white via-slate-100 to-indigo-100 bg-clip-text text-transparent">
              Discover Your Next Great Adventure
            </h1>
            <p className="text-slate-400 mt-4 text-base sm:text-lg max-w-xl font-medium">
              Explore user-published novels, interactive stories, and creative documents. Start reading or publish your own works today.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/dashboard/create-book"
              onClick={(e) => {
                if (!session) {
                  e.preventDefault();
                  alert("Please login first");
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              <span>Create Your own book</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search Bar Section */}
        <div className="relative mb-8 max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, category, or description..."
            className="w-full pl-12 pr-4 py-3.5 border border-card-border bg-white dark:bg-slate-900/60 text-foreground rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 text-sm font-medium"
          />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-card-border pb-6">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-card-border max-w-fit">
            {SORT_OPTIONS?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  sortBy === opt.value
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
 
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider hidden sm:inline">Category:</span>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 text-xs font-bold border border-card-border bg-white dark:bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all duration-200 cursor-pointer min-w-40"
            >
              <option value="All">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks?.map((book: any) => (
            <div
              key={book._id}
              className="group bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Cover Image Container */}
              <div className="aspect-4/3 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-card-border">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-tr from-slate-200 to-indigo-100/55 dark:from-slate-800 dark:to-slate-800 text-muted gap-2">
                    <BookOpen className="w-8 h-8 opacity-40 text-indigo-500" />
                    <span className="text-xs font-semibold opacity-60">No Cover Available</span>
                  </div>
                )}
                {/* Category Badge overlay */}
                {book.category && (
                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-white/10">
                    {book.category}
                  </span>
                )}
              </div>

              {/* Book Details */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-foreground leading-snug tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {book.name}
                </h2>

                {book.subtitle && (
                  <p className="text-muted italic text-xs mt-1.5 line-clamp-1">
                    {book.subtitle}
                  </p>
                )}

                <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 line-clamp-3 leading-relaxed flex-1">
                  {book.description || "No description provided."}
                </p>

                {/* Metrics & Action Footer */}
                <div className="mt-6 border-t border-card-border pt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      {book.author?.username || "Unknown"}
                    </span>
                    
                    <div className="flex items-center gap-3.5 text-xs text-muted font-bold">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 opacity-70" />
                        {book.views ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        {book.likesCount ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <Link 
                      href={`/dashboard/chaptersUi/all-chapter/${book._id}`}
                      className="w-full text-center py-2.5 px-4 bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
                    >
                      Read Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBooks?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-card-border text-center shadow-sm">
              <FolderOpen className="w-12 h-12 text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Books Found</h3>
              <p className="text-muted text-sm mt-1 max-w-sm">
                We couldn't find any books matching your query. Try adjusting your search query or filters.
              </p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
