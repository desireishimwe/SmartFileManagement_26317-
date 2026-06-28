import { ReactNode, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface Column<T> {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows, pageSize = 5, emptyMessage = 'No records found.' }: { columns: Column<T>[]; rows: T[]; pageSize?: number; emptyMessage?: string }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [page, pageSize, rows]);

  const changePage = (nextPage: number) => setPage(Math.min(Math.max(nextPage, 1), pageCount));

  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render(row)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
        <span className="small text-muted">
          Page {page} of {pageCount}
        </span>
        <div className="btn-group">
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => changePage(page - 1)} disabled={page === 1}>
            <FiChevronLeft />
          </button>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount}>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
