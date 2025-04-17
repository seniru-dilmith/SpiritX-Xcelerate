import React, { useEffect, useState } from "react";
import { fetchTournamentSummary } from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PlayerSummary {
  name: string;
  university: string;
  total_runs: number;
  wickets: number;
}

interface SummaryData {
  overallRuns: number;
  overallWickets: number;
  highestRunScorer: PlayerSummary;
  highestWicketTaker: PlayerSummary;
}

const TournamentSummary: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetchTournamentSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading summary...</div>;

  const chartData = [
    {
      label: "Overall",
      Runs: summary?.overallRuns || 0,
      Wickets: summary?.overallWickets || 0,
    },
    {
      label: "Top Scorer",
      Runs: summary?.highestRunScorer.total_runs || 0,
      Wickets: 0,
    },
    {
      label: "Top Wicket Taker",
      Runs: 0,
      Wickets: summary?.highestWicketTaker.wickets || 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-800">Tournament Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-200 to-blue-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-blue-800">Overall Runs</h3>
          <p className="text-4xl font-bold mt-2 text-blue-900">{summary?.overallRuns}</p>
        </div>
        <div className="bg-gradient-to-br from-green-200 to-green-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-green-800">Overall Wickets</h3>
          <p className="text-4xl font-bold mt-2 text-green-900">{summary?.overallWickets}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Highest Run Scorer</h3>
          <p className="text-lg font-bold text-yellow-800 mt-1">{summary?.highestRunScorer.name}</p>
          <p>{summary?.highestRunScorer.total_runs} Runs</p>
          <p className="text-sm text-gray-600">{summary?.highestRunScorer.university}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">Highest Wicket Taker</h3>
          <p className="text-lg font-bold text-red-800 mt-1">{summary?.highestWicketTaker.name}</p>
          <p>{summary?.highestWicketTaker.wickets} Wickets</p>
          <p className="text-sm text-gray-600">{summary?.highestWicketTaker.university}</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-center text-gray-700">Visual Overview</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Wickets" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TournamentSummary;
