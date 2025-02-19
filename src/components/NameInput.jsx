import { useState } from "react";
import "../styles/nameinput.css";

const NameInput = ({ onStart }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  const handleSubmit = () => {
    onStart(name, isMultiplayer, isMultiplayer ? room : "");
  };

  return (
    <div className="name-input-container">
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Room Code (optional)"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        disabled={!isMultiplayer}
      />
      <div className="toggle-container">
        <label>
          <input
            type="checkbox"
            checked={isMultiplayer}
            onChange={() => setIsMultiplayer(!isMultiplayer)}
          />
          Multiplayer
        </label>
      </div>
      <button onClick={handleSubmit}>Join Game</button>
    </div>
  );
};

export default NameInput;
