import { useState, useEffect } from "react";
import "../styles/game.css";

const decodeHtmlEntities = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const Game = ({ onGameOver, onCorrectAnswer, score }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft === 0) {
      setRevealAnswers(true);
      setTimerActive(false);
      setTimeout(() => {
        onGameOver();
      }, 3000);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, onGameOver]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
      const data = await res.json();
      if (data.results.length > 0) {
        const q = data.results[0];
        const shuffledAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
        setQuestion(decodeHtmlEntities(q.question));
        setAnswers(shuffledAnswers.map(decodeHtmlEntities));
        setCorrectAnswer(decodeHtmlEntities(q.correct_answer));
        setTimeLeft(20);
        setSelectedAnswer(null);
        setRevealAnswers(false);
        setTimerActive(true);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setRevealAnswers(true);
    setTimerActive(false);
    
    if (answer === correctAnswer) {
      onCorrectAnswer();
      setTimeout(() => fetchQuestion(), 3000);
    } else {
      setTimeout(() => {
        onGameOver();
      }, 3000);
    }
  };

  return (
    <div className="game-container">
      {question && (
        <div className="question-box">
          <div className="question-text">{question}</div>
          <div className="answers-grid">
            {answers.map((answer, index) => (
              <button
                key={index}
                className={`answer-button ${
                  revealAnswers && answer === correctAnswer ? "correct" : ""
                } ${
                  revealAnswers && answer !== correctAnswer ? "incorrect" : ""
                }`}
                onClick={() => handleAnswerClick(answer)}
                disabled={revealAnswers}
              >
                {answer}
              </button>
            ))}
          </div>
          <div className="timer">Time Left: {timeLeft}s</div>
        </div>
      )}
    </div>
  );
};

export default Game;
