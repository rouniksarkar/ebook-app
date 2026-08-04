"use client";

import { useEffect, useRef } from "react";

// Drop this anywhere on the chapter/book page. It fires once on mount.
// Renders nothing.
export default function ViewTracker({ bookId }: { bookId: string }) {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        fetch(`/api/books/${bookId}/view`, { method: "POST" }).catch(() => {
            // silently ignore - a failed view count shouldn't break the page
        });
    }, [bookId]);

    return null;
}