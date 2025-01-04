import React from 'react';
import '../styles/Header.css';

const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="elements">
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default Header;