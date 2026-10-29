"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useTableUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // create query string with updated parameters
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(paramsToUpdate)) {
        if (value === null || value === undefined || value === "" || value === "ALL") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      const search = current.toString();
      return search ? `?${search}` : "";
    },
    [searchParams],
  );

  // update url in place without page jump or full reload
  const updateUrl = useCallback(
    (paramsToUpdate: Record<string, string | number | null | undefined>) => {
      const query = createQueryString(paramsToUpdate);
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  const getParam = useCallback(
    (key: string, fallback: string = ""): string => {
      return searchParams.get(key) || fallback;
    },
    [searchParams],
  );

  const getNumberParam = useCallback(
    (key: string, fallback: number = 1): number => {
      const val = searchParams.get(key);
      if (!val) return fallback;
      const num = Number.parseInt(val, 10);
      return Number.isNaN(num) ? fallback : num;
    },
    [searchParams],
  );

  return {
    searchParams,
    pathname,
    getParam,
    getNumberParam,
    updateUrl,
    createQueryString,
  };
}
