import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  getLeaderboardForAdmin, 
  getLeaderboardForUser, 
  fetchTeam, 
  addTeamPlayer 
} from "../api/axios";
import { useLoading } from "../context/LoadingContext";
import { useAuth } from "../context/AuthContext";
import LeaderboardTable, { Player } from "../components/leaderboard/LeaderboardTable";
import LeaderboardControls from "../components/leaderboard/LeaderboardControls";
import socket from "../sockets";
import { useLocation } from "react-router-dom";

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("overall");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { loading, setLoading } = useLoading();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Comprehensive scroll restoration
  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedScrollKey = `leaderboard-scroll-${location.pathname}`;
      const savedScrollPosition = sessionStorage.getItem(savedScrollKey);
      
      if (savedScrollPosition && tableContainerRef.current) {
        const scrollPosition = parseInt(savedScrollPosition, 10);
        window.scrollTo(0, scrollPosition);
      }
    };

    // Restore scroll position after a short delay to ensure content is rendered
    const timeoutId = setTimeout(restoreScrollPosition, 100);

    // Save scroll position before unload
    const saveScrollPosition = () => {
      const savedScrollKey = `leaderboard-scroll-${location.pathname}`;
      sessionStorage.setItem(savedScrollKey, window.scrollY.toString());
    };

    // Add event listeners
    window.addEventListener('beforeunload', saveScrollPosition);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location.pathname]);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const savedScrollKey = `leaderboard-scroll-${location.pathname}`;
      sessionStorage.setItem(savedScrollKey, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const leaderboardApi = user.isAdmin ? getLeaderboardForAdmin : getLeaderboardForUser;
      const teamPromise = user.isAdmin ? Promise.resolve({ data: [] }) : fetchTeam();
      const [res, teamRes] = await Promise.all([
        leaderboardApi(searchTerm, sortBy, sortOrder, currentPage, pageSize),
        teamPromise,
      ]);
      const { rows, count } = res.data;
      setPlayers(rows);
      setTotalCount(count);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`Error loading players: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm, currentPage, pageSize, sortBy, sortOrder, setLoading]);

  useEffect(() => {
    if (!authLoading && user) {
      socket.on("playersUpdated", () => {
        fetchData();
      });
      fetchData();
    }
    return () => {
      socket.off("playersUpdated");
    };
  }, [fetchData, authLoading, user]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (column: string) => {
    if (column === sortBy) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleAddToTeam = async (playerId: number) => {
    try {
      setLoading(true);
      const res = await addTeamPlayer(playerId);
      setMessage(res.data.message || "Player added to team successfully.");
      await fetchData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`Error adding player to team: ${errorMsg}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div ref={tableContainerRef} className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-center mb-6">Leaderboard</h2>
      
      <LeaderboardControls
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
      
      {message && <div className="mb-4 text-center text-green-600">{message}</div>}
      {loading ? (
        <div className="text-center text-xl">Loading leaderboard...</div>
      ) : (
        <LeaderboardTable
            players={players}
            isAdmin={user?.isAdmin || false}
            onAddToTeam={handleAddToTeam}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortOrder={sortOrder} currentPage={0} pageSize={0} totalPlayers={0}        />
      )}
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Sorted by: {sortBy === "overall" ? "Overall Performance" : sortBy} ({sortOrder})
      </p>
    </div>
  );
};

export default Leaderboard;
