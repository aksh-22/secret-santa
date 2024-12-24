
import React from "react";
import { useParticipants } from "../context/ParticipantsContext";

const RandomizeAssignments = () => {
  const { randomizeAssignments } = useParticipants();

  return <button onClick={randomizeAssignments}>Randomize Assignments</button>;
};

export default RandomizeAssignments;
