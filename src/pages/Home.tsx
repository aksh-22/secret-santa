
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <h1>Welcome to Secret Santa</h1>
    <p>Manage participants, assign gifts, and ensure secrecy!</p>
    <nav>
      <Link to="/participants">Manage Participants</Link> | <Link to="/assignments">View Assignments</Link>
    </nav>
  </div>
);

export default Home;
