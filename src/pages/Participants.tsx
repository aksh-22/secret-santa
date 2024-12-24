
import React from "react";
import ParticipantForm from "../components/ParticipantForm";
import ParticipantList from "../components/ParticipantList";
import RandomizeAssignments from "../components/RandomizeAssignments";

const ParticipantsPage = () => (
  <div>
    <h2>Manage Participants</h2>
    <ParticipantForm />
    <ParticipantList />
    <RandomizeAssignments />
  </div>
);

export default ParticipantsPage;
