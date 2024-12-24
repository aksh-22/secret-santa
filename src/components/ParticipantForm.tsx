
import React, { useState } from "react";
import { useParticipants } from "../context/ParticipantsContext";

const ParticipantForm = () => {
  const { addParticipant } = useParticipants();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      addParticipant(name);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Participant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Participant</button>
    </form>
  );
};

export default ParticipantForm;
