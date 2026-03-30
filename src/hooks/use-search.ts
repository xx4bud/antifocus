import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  persistKey?: string;
}

interface UseSearchReturn {
  clearQuery: () => void;
  debouncedQuery: string;
  error: string | null;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  submitSearch: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 300,
    minQueryLength = 1,
    persistKey = "search-query",
  } = options;

  const router = useRouter();
  const [query, setQueryState] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setDebouncedQuery(query);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceMs]);

  useEffect(() => {
    if (persistKey && typeof window !== "undefined") {
      localStorage.setItem(persistKey, query);
    }
  }, [query, persistKey]);

  useEffect(() => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        setQueryState(saved);
      }
    }
    setIsHydrated(true);
  }, [persistKey]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    setError(null); // Clear error when user types
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState("");
    setError(null);
    setIsLoading(false);
  }, []);

  const validateQuery = useCallback(
    (queryToValidate: string): boolean => {
      if (!queryToValidate.trim()) {
        setError("Query pencarian tidak boleh kosong");
        return false;
      }
      if (queryToValidate.trim().length < minQueryLength) {
        setError(`Query pencarian minimal ${minQueryLength} karakter`);
        return false;
      }
      return true;
    },
    [minQueryLength]
  );

  const submitSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!validateQuery(trimmedQuery)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await router.push({ pathname: "/search", query: { q: trimmedQuery } });
    } catch (err) {
      setError("Terjadi kesalahan saat melakukan pencarian");
      console.error("Search navigation error:", err);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [query, router, validateQuery]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitSearch();
      } else if (e.key === "Escape") {
        clearQuery();
      }
    },
    [submitSearch, clearQuery]
  );

  return {
    query: isHydrated ? query : "",
    setQuery,
    debouncedQuery,
    isLoading,
    error,
    clearQuery,
    submitSearch,
    handleKeyDown,
  };
}
