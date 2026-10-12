import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

function pageHref(page, category) {
  const params = new URLSearchParams({ page: String(page) });
  if (category !== "Все") params.set("category", category);
  return `/?${params.toString()}#menu`;
}

export function Pagination({ currentPage, totalPages, category }) {
  if (totalPages <= 1) return null;

  const firstPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(totalPages, currentPage + 2);
  const visiblePages = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, index) => firstPage + index,
  );

  return (
    <nav className="pagination" aria-label="Навигация по страницам каталога">
      <a
        className={cn("page-link page-arrow", currentPage === 1 && "disabled")}
        href={pageHref(Math.max(1, currentPage - 1), category)}
        aria-label="Предыдущая страница"
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <ChevronLeft size={15} aria-hidden="true" /><span>Назад</span>
      </a>
      <div className="page-numbers">
        {visiblePages.map((page) => (
          <a
            key={page}
            className={cn("page-link", page === currentPage && "active")}
            href={pageHref(page, category)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </a>
        ))}
      </div>
      <a
        className={cn("page-link page-arrow", currentPage === totalPages && "disabled")}
        href={pageHref(Math.min(totalPages, currentPage + 1), category)}
        aria-label="Следующая страница"
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        <span>Вперёд</span><ChevronRight size={15} aria-hidden="true" />
      </a>
    </nav>
  );
}
