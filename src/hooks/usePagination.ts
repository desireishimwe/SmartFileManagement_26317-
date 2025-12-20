import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

export const usePagination = ({ initialPage = 0, initialSize = 10 }: UsePaginationOptions = {}) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(0, newPage));
  }, []);

  const changeSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  }, []);

  return {
    page,
    size,
    setPage,
    setSize,
    nextPage,
    prevPage,
    goToPage,
    changeSize,
  };
};

