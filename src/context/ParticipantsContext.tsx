
import React, { createContext, useState, useContext } from "react";

const generateSecretCode = () => Math.random().toString(36).substr(2, 8);

const ParticipantsContext = createContext(null);

export const ParticipantsProvider = ({ children }: { children: React.ReactNode }) => {
  const [participants, setParticipants] = useState([]);
  const [assignments, setAssignments] = useState({});

  const addParticipant = (name: string) => {
    const code = generateSecretCode();
    setParticipants([...participants, { name, code }]);
  };

  const randomizeAssignments = () => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const assignmentMap: Record<string, string> = {};
    shuffled.forEach((p, i) => {
      assignmentMap[p.code] = shuffled[(i + 1) % shuffled.length].name;
    });
    setAssignments(assignmentMap);
  };

  const getAssignment = (adminCode: string, userCode: string) => {
    const adminSecret = "admin1234";
    if (adminCode + userCode === adminSecret + userCode) {
      return assignments[userCode] || "Assignment not found";
    }
    return "Invalid code!";
  };

  return (
    <ParticipantsContext.Provider value={{ participants, addParticipant, randomizeAssignments, getAssignment }}>
      {children}
    </ParticipantsContext.Provider>
  );
};

export const useParticipants = () => useContext(ParticipantsContext);
