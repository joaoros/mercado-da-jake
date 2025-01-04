import React from 'react';
import deleteIcon from '../assets/delete.svg';
import '../styles/Footer.css';

const Footer = ({ totalCost, clearList, limit }) => {
  return (
    <footer className="footer">
      <div className="total-cost">
        Total: R$ {totalCost.toFixed(2).replace('.', ',')}
      </div>
      {limit !== null && (
        <div className="limit" style={{ fontWeight: limit < 0 ? 'bold' : 'normal' }}>
          Limite: R$ {limit.toFixed(2).replace('.', ',')}
        </div>
      )}
      <img src={deleteIcon} alt="Limpar Lista" onClick={clearList} className="clear-list" />
    </footer>
  );
};

export default Footer;