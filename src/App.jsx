import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/App.css';
import editIcon from './assets/edit.svg';
import deleteIcon from './assets/delete.svg';
import boxIcon from './assets/box.svg';

const App = () => {
  const [items, setItems] = React.useState(() => {
    const savedItems = localStorage.getItem('shoppingList');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [newItem, setNewItem] = React.useState('');
  const [formattedPrice, setFormattedPrice] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editingItem, setEditingItem] = React.useState({ name: '', price: '' });
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isClearListModalOpen, setIsClearListModalOpen] = React.useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = React.useState(false);
  const [isResetLimitModalOpen, setIsResetLimitModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [limit, setLimit] = React.useState(null);
  const [limitValue, setLimitValue] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const formatPrice = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    const formattedValue = (cleanedValue / 100).toFixed(2);
    return formattedValue;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormattedPrice(formatPrice(value));
  };

  const handleEditPriceChange = (e) => {
    const value = e.target.value;
    setEditingItem({ ...editingItem, price: formatPrice(value) });
  };

  const addItem = () => {
    if (!newItem.trim() || !formattedPrice.trim()) {
      setErrorMessage('Nome do item e preço são obrigatórios.');
      return;
    }
    const itemPrice = parseFloat(formattedPrice);
    setItems([...items, { name: newItem, price: itemPrice, quantity: 1 }]);
    setNewItem('');
    setFormattedPrice('');
    setErrorMessage('');
    if (limit !== null) {
      setLimit(limit - itemPrice);
    }
    closeModal();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const confirmDeleteItem = (index) => {
    setItemToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const deleteItem = () => {
    const itemPrice = items[itemToDelete].price;
    setItems(items.filter((_, i) => i !== itemToDelete));
    if (limit !== null) {
      setLimit(limit + itemPrice);
    }
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const startEditing = (index) => {
    const itemToEdit = items[index];
    setEditingIndex(index);
    setEditingItem({
      name: itemToEdit.name,
      price: itemToEdit.price.toFixed(2)
    });
    setIsEditModalOpen(true);
  };

  const saveEdit = (index) => {
    if (!editingItem.name.trim() || !editingItem.price) {
      setErrorMessage('Nome do item e preço são obrigatórios.');
      return;
    }
    const updatedItems = [...items];
    const oldPrice = items[index].price;
    const newPrice = parseFloat(editingItem.price);
    updatedItems[index] = {
      ...editingItem,
      price: newPrice,
      quantity: items[index].quantity
    };
    setItems(updatedItems);
    if (limit !== null) {
      setLimit(limit + oldPrice - newPrice);
    }
    setEditingIndex(null);
    setEditingItem({ name: '', price: '' });
    setErrorMessage('');
    setIsEditModalOpen(false);
  };

  const confirmClearList = () => {
    if (items.length === 0 && limit !== null) {
      setIsResetLimitModalOpen(true);
    } else {
      setIsClearListModalOpen(true);
    }
  };

  const clearList = () => {
    setItems([]);
    localStorage.removeItem('shoppingList');
    setIsClearListModalOpen(false);
    setLimit(null);
  };

  const incrementQuantity = (index) => {
    const updatedItems = [...items];
    updatedItems[index].quantity += 1;
    setItems(updatedItems);
  };

  const decrementQuantity = (index) => {
    const updatedItems = [...items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setItems(updatedItems);
    }
  };

  const totalCost = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const openModal = () => {
    if (items.length === 0 && limit === null) {
      setIsLimitModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsLimitModalOpen(false);
    setIsResetLimitModalOpen(false);
  };

  const setLimitValueHandler = () => {
    setLimit(parseFloat(formatPrice(limitValue)));
    setLimitValue('');
    setIsLimitModalOpen(false);
  };

  const resetLimitHandler = () => {
    setLimit(null);
    setIsResetLimitModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <Header title="Mercado da Jake 🛒💗" />
      <main>
        {items.length === 0 ? (
          <div className="empty-list">
            <img src={boxIcon} alt="Lista vazia" className="empty-list-icon" />
            <p>Sua lista de compras está vazia.</p>
          </div>
        ) : (
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
        )}
      </main>
      <Footer totalCost={totalCost} clearList={confirmClearList} limit={limit} />
      <button className="floating-button" onClick={openModal}>+</button>
      {isModalOpen && (
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
              <button onClick={addItem}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={deleteIcon} alt="Fechar" onClick={() => setIsEditModalOpen(false)} className="close-button" />
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
              <button className="save-edit-button" onClick={() => saveEdit(editingIndex)}>Salvar</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={deleteIcon} alt="Fechar" onClick={() => setIsDeleteModalOpen(false)} className="close-button" />
            <p>Tem certeza que deseja deletar este item?</p>
            <button className="modal-button" onClick={deleteItem}>Sim</button>
            <button className="modal-button" onClick={() => setIsDeleteModalOpen(false)}>Não</button>
          </div>
        </div>
      )}
      {isClearListModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={deleteIcon} alt="Fechar" onClick={() => setIsClearListModalOpen(false)} className="close-button" />
            <p>Tem certeza que deseja limpar a lista?</p>
            <button className="modal-button" onClick={clearList}>Sim</button>
            <button className="modal-button" onClick={() => setIsClearListModalOpen(false)}>Não</button>
          </div>
        </div>
      )}
      {isResetLimitModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
            <p>A lista está vazia. Gostaria de resetar o limite?</p>
            <button className="modal-button" onClick={resetLimitHandler}>Sim</button>
            <button className="modal-button" onClick={() => setIsResetLimitModalOpen(false)}>Não</button>
          </div>
        </div>
      )}
      {isLimitModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img src={deleteIcon} alt="Fechar" onClick={closeModal} className="close-button" />
            <div className="add-item-modal">
              <input
                type="number"
                placeholder="Definir valor limite (R$)"
                value={limitValue}
                onChange={(e) => setLimitValue(formatPrice(e.target.value))}
                pattern="[0-9]*"
              />
              <button onClick={setLimitValueHandler}>Definir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;