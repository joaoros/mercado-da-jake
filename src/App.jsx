import React from 'react';
import Header from './components/Header';
import './styles/App.css';

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
    setItems([...items, { name: newItem, price: parseFloat(formattedPrice) }]);
    setNewItem('');
    setFormattedPrice('');
    setErrorMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    const itemToEdit = items[index];
    setEditingIndex(index);
    setEditingItem({
      name: itemToEdit.name,
      price: itemToEdit.price.toFixed(2)
    });
  };

  const saveEdit = (index) => {
    if (!editingItem.name.trim() || !editingItem.price) {
      setErrorMessage('Nome do item e preço são obrigatórios.');
      return;
    }
    const updatedItems = [...items];
    updatedItems[index] = {
      ...editingItem,
      price: parseFloat(editingItem.price)
    };
    setItems(updatedItems);
    setEditingIndex(null);
    setEditingItem({ name: '', price: '' });
    setErrorMessage('');
  };

  const clearList = () => {
    setItems([]);
    localStorage.removeItem('shoppingList');
  };

  const totalCost = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="app">
      <Header title="🛒 Mercado da Jake 💗" />
      <main className="content">
        <div className="add-item">
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <ul className="item-list">
          {items.map((item, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <>
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
                  <button className="save-edit-button" onClick={() => saveEdit(index)}>Salvar</button>
                </>
              ) : (
                <>
                  <span>{item.name}</span>
                  <span>R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  <div className="actions">
                    <button onClick={() => startEditing(index)}>Editar</button>
                    <button onClick={() => removeItem(index)}>Remover</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="total">Total: R$ {totalCost.toFixed(2).replace('.', ',')}</div>
        <button onClick={clearList} className="clear-list-button">Limpar Lista</button>
      </main>
    </div>
  );
};

export default App;