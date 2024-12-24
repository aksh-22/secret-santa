
import React from "react";
import { useParticipants } from "../context/ParticipantsContext";

const ParticipantList = () => {
  const { participants } = useParticipants();

  return (
    <ul>
      {participants.map((p, index) => (
        <li key={index}>
          {p.name} (Code: {p.code})
        </li>
      ))}
    </ul>
  );
};

export default ParticipantList;
