
import React, { useState } from "react";
import { useParticipants } from "../context/ParticipantsContext";

const AccessAssignments = () => {
  const { getAssignment } = useParticipants();
  const [adminCode, setAdminCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [result, setResult] = useState("");

  const handleAccess = () => {
    setResult(getAssignment(adminCode, userCode));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Admin Code"
        value={adminCode}
        onChange={(e) => setAdminCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="User Code"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
      />
      <button onClick={handleAccess}>View Assignment</button>
      <p>{result}</p>
    </div>
  );
};

export default AccessAssignments;
