import React from 'react';

import '../styles/ItemForm.css';

const ItemForm = ({ newItem, setNewItem, formattedPrice, handlePriceChange, addItem, handleKeyDown, errorMessage }) => {
  return (
    <div className="add-item-modal">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Nome do item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="number"
        placeholder="Preço (R$)"
        value={formattedPrice}
        onChange={handlePriceChange}
        onKeyDown={handleKeyDown}
        pattern="[0-9]*"
      />
      <button onClick={addItem}>Adicionar</button>
    </div>
  );
};

export default ItemForm;