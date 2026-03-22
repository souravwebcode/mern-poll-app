import { votePoll } from "../services/api";
import { useEffect, useState, useRef } from "react";

export default function PollItem({ poll, refresh }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const refreshRef = useRef(refresh);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!poll.expiry) return;

    let timer;

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(poll.expiry);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsUrgent(false);

        if (
          !hasRefreshed.current &&
          typeof refreshRef.current === "function"
        ) {
          hasRefreshed.current = true;
          refreshRef.current();
        }
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        setIsUrgent(diff <= 10000);

        timer = setTimeout(updateTimer, 1000);
      }
    };

    updateTimer();
    return () => clearTimeout(timer);
  }, [poll.expiry]);

  const handleVote = async (index) => {
    try {
      await votePoll(poll._id, index);

      if (typeof refreshRef.current === "function") {
        refreshRef.current();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error voting");
    }
  };

  return (
    <div className="poll">
      <h3>{poll.question}</h3>

      <p className={poll.status === "Active" ? "active" : "expired"}>
        {poll.status}
      </p>

      <p>Total Votes: {poll.totalVotes}</p>

      {/* ⏳ Timer */}
      <p style={{ color: isUrgent ? "red" : "" }}>
        ⏳ {timeLeft}
      </p>

      <div className="options">
        {poll.options.map((opt, i) => {
          const percent =
            poll.totalVotes > 0
              ? (opt.votes / poll.totalVotes) * 100
              : 0;

          return (
            <div key={i} style={{ marginBottom: "15px" }}>
              
              {/* 🖼️ IMAGE FIXED */}
              {opt.image && (
                <img
                  src={`http://localhost:5000${opt.image}`}
                  alt={opt.text}
                  style={{
                    width: "100%",
                    maxHeight: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "5px",
                  }}
                />
              )}

              <button
                onClick={() => handleVote(i)}
                disabled={poll.status === "Expired"}
                className={
                  poll?.winner?.text === opt.text ? "winner-btn" : ""
                }
              >
                {opt.text} ({opt.votes})
              </button>

              {/* 📊 Progress */}
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🏆 Winner */}
      {poll.status === "Expired" && poll.totalVotes > 0 && (
        <p className="winner">🏆 Winner: {poll?.winner?.text}</p>
      )}
    </div>
  );
}