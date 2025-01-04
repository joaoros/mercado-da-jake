import React from 'react';
import '../styles/Header.css';

const Header = ({ emoji, title }) => {
  return (
    <header className="header">
      <div className="elements">
        <h1>{emoji}</h1>
        <h1>{title}</h1>
      </div>
    </header>
  );
};

export default Header;