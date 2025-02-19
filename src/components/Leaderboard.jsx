import React from "react";

import "../styles/leaderboard.css";

const Leaderboard = ({ scores }) => {
  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-list">
        {scores.length === 0 ? (
          <p className="no-players">No players yet</p>
        ) : (
          scores.map((player, index) => (
            <div key={index} className="leaderboard-item">
              <span>{player.name}</span>
              <span className={`score ${getScoreColor(player.score)}`}>
                {player.score}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

//Function to determine score color class
const getScoreColor = (score) => {
  if (score >= 10) return "high-score"; //Green for high scores
  if (score >= 5) return "mid-score"; //Orange for medium scores
  return "low-score"; //Red for low scores
};

export default Leaderboard;
