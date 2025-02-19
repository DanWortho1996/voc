import { useState, useEffect } from "react";
import "./styles/popup.css";
import "./styles/game.css";
import "./styles/leaderboard.css";
import "./styles/nameinput.css";
import "./styles/responsive.css";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Footer from "./components/Footer";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import NameInput from "./components/NameInput";
import { io } from "socket.io-client";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || process.env.REACT_APP_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || process.env.REACT_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID || process.env.REACT_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID || process.env.REACT_APP_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const socket = io("https://voc-be.onrender.com", {
  transports: ["websocket", "polling"]
});

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [room, setRoom] = useState("");
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  useEffect(() => {
    socket.on("updateLeaderboard", (scores) => {
      setLeaderboard(scores);
    });

    socket.on("nextPlayer", ({ nextPlayer, room: gameRoom }) => {
      if (nextPlayer === playerName && gameRoom === room) {
        setGameStarted(true);
      }
    });

    socket.on("playerEliminated", ({ eliminatedPlayer, room: gameRoom }) => {
      if (eliminatedPlayer === playerName && gameRoom === room) {
        handleGameOver();
      }
    });

    return () => {
      socket.off("updateLeaderboard");
      socket.off("nextPlayer");
      socket.off("playerEliminated");
    };
  }, [playerName, room]);

  useEffect(() => {
    socket.on("playersInRoom", (players) => {
      setPlayersInRoom(players);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      socket.off("playersInRoom");
      socket.off("error");
    };
  }, []);

  const fetchLeaderboard = async () => {
    const querySnapshot = await getDocs(collection(db, "leaderboard"));
    const scores = querySnapshot.docs.map(doc => doc.data());
    setLeaderboard(scores);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const startGame = (name, multiplayer, roomNumber) => {
    setPlayerName(name);
    setIsMultiplayer(multiplayer);
    setRoom(multiplayer ? roomNumber : "");
    setScore(0);
    setShowPopup(false);

    setTimeout(() => {
      if (multiplayer) {
        socket.emit("joinGame", { name, room: roomNumber });
        socket.on("joinSuccess", (data) => {
          console.log("Server confirmed join:", data);
        });
      } else {
        setGameStarted(true);
      }
    }, 100);
  };

  const handleGameOver = async () => {
    await setDoc(doc(db, "leaderboard", playerName), { name: playerName, score });
    socket.emit("updateScore", { name: playerName, score });
    setGameStarted(false);
    setShowPopup(true);
    fetchLeaderboard();

    if (isMultiplayer) {
      socket.emit("playerLost", { name: playerName, room });
      socket.on("gameOver", () => {
        setShowPopup(true);
      });
    }
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 3);
  };

  return (
    <div className="app-container">
      <Header />
      <Instructions />
      <div className="main-layout">
        <div className="game-container">
          <div className="game-section">
            {!gameStarted ? (
              <NameInput onStart={startGame} />
            ) : (
              <Game onGameOver={handleGameOver} onCorrectAnswer={incrementScore} score={score} />
            )}
          </div>
        </div>
        <div className="leaderboard-wrapper">
          <Leaderboard scores={leaderboard} />
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Game Over</h2>
            <p>{playerName}, you scored {score} points!</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
