import { useState } from "react";
import { MONTH_NAMES } from "../types";

interface WelcomeProps {
  currentMonth: number;
  currentYear: number;
  onStart: (name: string) => void;
}

export function Welcome({ currentMonth, currentYear, onStart }: WelcomeProps) {
  const [name, setName] = useState("");

  return (
    <div className="welcome">
      <div className="welcome-inner">
        <span className="welcome-icon">✉</span>
        <h1>Your Annual Letter</h1>
        <p className="welcome-tagline">
          Answer a handful of prompts each month. At year's end, they become a
          letter you'll want to keep.
        </p>
        <div className="welcome-how">
          <div className="how-step">
            <span className="how-num">01</span>
            <span>Answer 6 prompts each month — takes about 10 minutes</span>
          </div>
          <div className="how-step">
            <span className="how-num">02</span>
            <span>Add year-end reflections in December</span>
          </div>
          <div className="how-step">
            <span className="how-num">03</span>
            <span>Read (and keep) your compiled letter</span>
          </div>
        </div>
        <div className="welcome-form">
          <label className="welcome-label">What should the letter call you?</label>
          <input
            type="text"
            className="welcome-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onStart(name.trim())}
          />
          <button
            className="btn-primary btn-large"
            disabled={!name.trim()}
            onClick={() => onStart(name.trim())}
          >
            Start — {MONTH_NAMES[currentMonth]} {currentYear}
          </button>
        </div>
      </div>
    </div>
  );
}
