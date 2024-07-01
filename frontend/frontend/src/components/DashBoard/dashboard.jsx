import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">Dashboard</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="navbar-nav">
              <Link to="/login" className="nav-link">Sign Up</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="jumbotron text-center">
          <h1 className="display-4">Welcome to your Dashboard</h1>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
