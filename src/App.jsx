import React, { useRef } from 'react';
import Header from './components/Header';
import './styles/App.css';

const App = () => {
  const [items, setItems] = React.useState(() => {
    const savedItems = localStorage.getItem('shoppingList');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [newItem, setNewItem] = React.useState('');
  const [newPrice, setNewPrice] = React.useState('');
  const [formattedPrice, setFormattedPrice] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editingItem, setEditingItem] = React.useState({ name: '', price: '' });

  React.useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const formatPrice = (value) => {
    const cleanedValue = value.replace(/\D/g, '');
    const formattedValue = (cleanedValue / 100).toFixed(2).replace('.', ',');
    return formattedValue;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setNewPrice(value);
    setFormattedPrice(formatPrice(value));
  };

  const addItem = () => {
    if (newItem.trim() && newPrice.trim()) {
      setItems([...items, { name: newItem, price: parseFloat(newPrice.replace(',', '.')), purchased: false }]);
      setNewItem('');
      setNewPrice('');
      setFormattedPrice('');
    }
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
    setEditingIndex(index);
    setEditingItem({ name: items[index].name, price: items[index].price });
  };

  const saveEdit = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, name: editingItem.name, price: parseFloat(editingItem.price) } : item
    );
    setItems(updatedItems);
    setEditingIndex(null);
    setEditingItem({ name: '', price: '' });
  };

  const clearList = () => {
    setItems([]);
    localStorage.removeItem('shoppingList');
  };

  const totalCost = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="app">
      <Header title="Mercado da Ja 🛒" />
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
            type="text"
            placeholder="Preço (R$)"
            value={formattedPrice}
            onChange={handlePriceChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={addItem}>Adicionar</button>
        </div>
        <ul className="item-list">
          {items.map((item, index) => (
            <li key={index} className={item.purchased ? 'purchased' : ''}>
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
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="edit-input"
                  />
                  <button className="save-edit-button" onClick={() => saveEdit(index)}>Salvar</button>
                </>
              ) : ( 
                <>
                  <span>{item.name}</span>
                  <span>R$ {item.price.toFixed(2)}</span>
                  <div className="actions">
                    <button onClick={() => startEditing(index)}>Editar</button>
                    <button onClick={() => removeItem(index)}>Remover</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="total">Total: R$ {totalCost.toFixed(2)}</div>
        <button onClick={clearList} className="clear-list-button">Limpar Lista</button>
      </main>
    </div>
  );
};

export default App;