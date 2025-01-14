import React from 'react';
import deleteIcon from '../assets/delete.svg';

import '../styles/Modals.css';

export const AddItemModal = ({ isOpen, closeModal, errorMessage, newItem, setNewItem, formattedPrice, handlePriceChange, addItem, handleKeyDown, newItemQuantity, setNewItemQuantity }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
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
          <input
            type="number"
            placeholder="Quantidade"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            min="1"
          />
          <button onClick={addItem}>Adicionar</button>
        </div>
      </div>
    </div>
  );
};

export const EditItemModal = ({ isOpen, closeModal, errorMessage, editingItem, setEditingItem, handleEditPriceChange, saveEdit, editingIndex, editingItemQuantity, setEditingItemQuantity }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
        <div className="add-item-modal">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <input
            type="text"
            value={editingItem.name}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            className="edit-input"
          />
          <input
            type="number"
            value={editingItem.price}
            onChange={handleEditPriceChange}
            className="edit-input"
            pattern="[0-9]*"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={editingItemQuantity}
            onChange={(e) => setEditingItemQuantity(e.target.value)}
            min="1"
            pattern="[0-9]*"
          />
          <button className="save-edit-button" onClick={() => saveEdit(editingIndex)}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmDeleteModal = ({ isOpen, closeModal, deleteItem }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
        <p>Tem certeza que deseja deletar este item?</p>
        <button className="modal-button" onClick={deleteItem}>Sim</button>
        <button className="modal-button" onClick={closeModal}>Não</button>
      </div>
    </div>
  );
};


export const SetLimitModal = ({ isOpen, closeModal, limitValue, handleLimitValue, setLimitValueHandler }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
        <div className="add-item-modal">
          <input
            type="number"
            placeholder="Definir valor limite (R$)"
            value={limitValue}
            onChange={handleLimitValue}
            pattern="[0-9]*"
            />
          <button onClick={setLimitValueHandler}>Definir</button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmClearListModal = ({ isOpen, closeModal, clearList }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
        <p>Tem certeza que deseja limpar a lista?</p>
        <button className="modal-button" onClick={clearList}>Sim</button>
        <button className="modal-button" onClick={closeModal}>Não</button>
      </div>
    </div>
  );
};

export const ResetLimitModal = ({ isOpen, closeModal, resetLimitHandler }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
        <p>A lista está vazia. Gostaria de resetar o limite?</p>
        <button className="modal-button" onClick={resetLimitHandler}>Sim</button>
        <button className="modal-button" onClick={closeModal}>Não</button>
      </div>
    </div>
  );
};