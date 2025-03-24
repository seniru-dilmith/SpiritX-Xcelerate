import React from 'react';

export interface Player {
  id: number;
  name: string;
  university: string;
  category: string;
  total_runs: number;
  balls_faced: number;
  innings_played: number;
  wickets: number;
  overs_bowled: number;
  runs_conceded: number;
  value_in_rupees: number;
  points: number;
  inTeam?: boolean;
}

interface LeaderboardTableProps {
  players: Player[];
  isAdmin: boolean;
  onAddToTeam?: (id: number) => void;
  onSortChange: (column: string) => void;
  onPageChange?: (page: number) => void;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  currentPage: number;
  pageSize: number;
  totalPlayers: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  isAdmin,
  onAddToTeam,
  onSortChange,
  onPageChange,
  sortBy,
  sortOrder,
  currentPage,
  pageSize,
  totalPlayers
}) => {
  const formatNumber = (value: number, decimalPlaces: number = 2) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };

  const renderHeader = (label: string, column: string) => (
    <th 
      onClick={() => onSortChange(column)}
      className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition"
    >
      <div className="flex items-center">
        {label}
        {sortBy === column && (
          <span className="ml-2">
            {sortOrder === "ASC" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );

  // Calculate the starting index based on current page and page size
  const startIndex = (currentPage - 1) * pageSize + 1;

  // Calculate total pages
  const totalPages = Math.ceil(totalPlayers / pageSize);

  // Pagination component
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange && onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            currentPage === i 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button 
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        {pageNumbers}
        <button 
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-blue-50">
      <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg border-2 border-blue-500">
        <table className="w-full">
          <thead className="bg-blue-600 text-white border-b-2 border-blue-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                #
              </th>
              {renderHeader("Name", "name")}
              {renderHeader("University", "university")}
              {renderHeader("Category", "category")}
              {renderHeader("Total Runs", "total_runs")}
              {renderHeader("Balls Faced", "balls_faced")}
              {renderHeader("Innings Played", "innings_played")}
              {renderHeader("Wickets", "wickets")}
              {renderHeader("Overs Bowled", "overs_bowled")}
              {renderHeader("Runs Conceded", "runs_conceded")}
              {isAdmin && renderHeader("Points", "points")}
              {renderHeader("Value", "value_in_rupees")}
              {!isAdmin && <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-200">
            {players.map((player, index) => (
              <tr key={player.id} className="hover:bg-blue-100 transition">
                <td className="px-4 py-2 text-sm text-blue-700">
                  {startIndex + index}
                </td>
                <td className="px-4 py-2 text-sm font-medium text-blue-900">{player.name}</td>
                <td className="px-4 py-2 text-sm text-blue-700">{player.university}</td>
                <td className="px-4 py-2 text-sm text-blue-700">{player.category}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.total_runs, 0)}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.balls_faced, 0)}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.innings_played, 0)}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.wickets, 0)}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.overs_bowled, 1)}</td>
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.runs_conceded, 0)}</td>
                {isAdmin && (
                  <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.points)}</td>
                )}
                <td className="px-4 py-2 text-sm text-blue-700 text-right">{formatNumber(player.value_in_rupees, 0)}</td>
                {!isAdmin && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onAddToTeam && onAddToTeam(player.id)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        player.inTeam 
                          ? 'bg-green-100 text-green-800 cursor-default' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      } disabled:opacity-50`}
                      disabled={player.inTeam}
                    >
                      {player.inTeam ? "Added" : "Add"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default LeaderboardTable;
