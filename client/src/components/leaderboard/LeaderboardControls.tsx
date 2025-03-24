import React, { ChangeEvent } from "react";

interface LeaderboardControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
  searchTerm,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="p-2 border rounded w-full sm:w-64"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaderboardControls;
