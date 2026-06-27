import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    loading = false,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((page, idx) =>
                page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg transition ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronRight className="w-4 h-4" />
            </button>

            <span className="ml-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
};

export default Pagination;
