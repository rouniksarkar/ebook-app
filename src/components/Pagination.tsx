'use client';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 mt-12 bg-white dark:bg-slate-900/40 p-3 rounded-2xl border border-card-border max-w-fit mx-auto shadow-sm">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 text-sm font-semibold border border-card-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            >
                Previous
            </button>

            <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-200 ${
                                currentPage === page
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                    : "border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-muted hover:text-foreground"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 text-sm font-semibold border border-card-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200"
            >
                Next
            </button>
        </div>
    );
}