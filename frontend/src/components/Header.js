import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/report">Report Crowd</Link></li>
        <li><Link to="/predictions">Predictions</Link></li>
      </ul>
    </nav>
  );
}

export default Header;