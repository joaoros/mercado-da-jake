import React from 'react';
import editIcon from '../assets/edit.svg';
import deleteIcon from '../assets/delete.svg';

const ItemList = ({ items, startEditing, confirmDeleteItem, incrementQuantity, decrementQuantity }) => {
  return (
    <ul className="item-list">
      {items.map((item, index) => (
        <li key={index}>
          <span>{item.name}</span>
          <span>R$ {item.price.toFixed(2).replace('.', ',')}</span>
          <div className="quantity-controls">
            <button onClick={() => decrementQuantity(index)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => incrementQuantity(index)}>+</button>
          </div>
          <div className="actions">
            <img src={editIcon} alt="Editar" onClick={() => startEditing(index)} className="action-icon" />
            <img src={deleteIcon} alt="Remover" onClick={() => confirmDeleteItem(index)} className="action-icon" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;