import React, { useState } from "react";

export interface Player {
  id?: number;
  name: string;
  university: string;
  category: string;
  total_runs: number;
  balls_faced: number;
  innings_played: number;
  wickets: number;
  overs_bowled: number;
  runs_conceded: number;
  points: number;
  value_in_rupees: number;
}

interface PlayerModalProps {
  initialData?: Partial<Player>;
  onSubmit: (data: Partial<Player>) => void;
  onCancel: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Player>>({
    name: initialData.name || "",
    university: initialData.university || "",
    category: initialData.category || "",
    total_runs: initialData.total_runs || 0,
    balls_faced: initialData.balls_faced || 0,
    innings_played: initialData.innings_played || 0,
    wickets: initialData.wickets || 0,
    overs_bowled: initialData.overs_bowled || 0,
    runs_conceded: initialData.runs_conceded || 0,
    points: initialData.points || 0,
    value_in_rupees: initialData.value_in_rupees || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Prevent updating computed fields.
    if (name === "points" || name === "value_in_rupees") return;
    setFormData((prev) => ({
      ...prev,
      [name]: ["total_runs", "balls_faced", "innings_played", "wickets", "overs_bowled", "runs_conceded"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="block font-semibold">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {/* University */}
      <div className="space-y-1">
        <label htmlFor="university" className="block font-semibold">
          University
        </label>
        <input
          id="university"
          type="text"
          name="university"
          value={formData.university}
          onChange={handleChange}
          placeholder="University"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="category" className="block font-semibold">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
          disabled={initialData.id !== undefined} // Disable editing category if player exists.
        >
          <option value="All-Rounder">All-Rounder</option>
          <option value="Bowler">Bowler</option>
          <option value="Batsman">Batsman</option>
        </select>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="total_runs" className="block font-semibold">
            Total Runs
          </label>
          <input
            id="total_runs"
            type="number"
            name="total_runs"
            value={formData.total_runs}
            onChange={handleChange}
            placeholder="Total Runs"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="balls_faced" className="block font-semibold">
            Balls Faced
          </label>
          <input
            id="balls_faced"
            type="number"
            name="balls_faced"
            value={formData.balls_faced}
            onChange={handleChange}
            placeholder="Balls Faced"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="innings_played" className="block font-semibold">
            Innings Played
          </label>
          <input
            id="innings_played"
            type="number"
            name="innings_played"
            value={formData.innings_played}
            onChange={handleChange}
            placeholder="Innings Played"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="wickets" className="block font-semibold">
            Wickets
          </label>
          <input
            id="wickets"
            type="number"
            name="wickets"
            value={formData.wickets}
            onChange={handleChange}
            placeholder="Wickets"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="overs_bowled" className="block font-semibold">
            Overs Bowled
          </label>
          <input
            id="overs_bowled"
            type="number"
            name="overs_bowled"
            value={formData.overs_bowled}
            onChange={handleChange}
            placeholder="Overs Bowled"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="runs_conceded" className="block font-semibold">
            Runs Conceded
          </label>
          <input
            id="runs_conceded"
            type="number"
            name="runs_conceded"
            value={formData.runs_conceded}
            onChange={handleChange}
            placeholder="Runs Conceded"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Computed Fields: Only show when editing */}
      {initialData.id !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="points" className="block font-semibold">
              Points
            </label>
            <input
              id="points"
              type="number"
              name="points"
              value={formData.points}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
              placeholder="Points"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="value_in_rupees" className="block font-semibold">
              Value (in Rupees)
            </label>
            <input
              id="value_in_rupees"
              type="number"
              name="value_in_rupees"
              value={formData.value_in_rupees}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
              placeholder="Value in Rupees"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PlayerModal;
