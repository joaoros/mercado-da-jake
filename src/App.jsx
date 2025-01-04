import React from 'react';
import { Header, Footer, ItemList } from './components';
import { AddItemModal, EditItemModal, ConfirmDeleteModal, ConfirmClearListModal, SetLimitModal, ResetLimitModal } from './components/Modals';
import { getShoppingList, saveShoppingList, removeShoppingList } from './service/localStorage';
import { formatPrice } from './service/formatting';
import boxIcon from './assets/box.svg';
import './styles/App.css';

const App = () => {
  const [items, setItems] = React.useState(getShoppingList);
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
    saveShoppingList(items);
  }, [items]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormattedPrice(formatPrice(value));
  };

  const handleLimitValue = (e) => {
    const value = e.target.value;
    setLimitValue(formatPrice(value));
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
    const itemPrice = items[itemToDelete].price * items[itemToDelete].quantity;
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
      setLimit(limit + (oldPrice - newPrice) * items[index].quantity);
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
    removeShoppingList();
    setIsClearListModalOpen(false);
    setLimit(null);
  };

  const incrementQuantity = (index) => {
    const updatedItems = [...items];
    updatedItems[index].quantity += 1;
    setItems(updatedItems);
    if (limit !== null) {
      setLimit(limit - updatedItems[index].price);
    }
  };

  const decrementQuantity = (index) => {
    const updatedItems = [...items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setItems(updatedItems);
      if (limit !== null) {
        setLimit(limit + updatedItems[index].price);
      }
    }
  };

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
  };

  const totalCost = items.reduce((total, item) => total + item.price * item.quantity, 0);

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
          <ItemList
            items={items}
            startEditing={startEditing}
            confirmDeleteItem={confirmDeleteItem}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        )}
      </main>
      <Footer totalCost={totalCost} clearList={confirmClearList} limit={limit} items={items} />
      <button className="floating-button" onClick={openModal}>+</button>
      <AddItemModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        errorMessage={errorMessage}
        newItem={newItem}
        setNewItem={setNewItem}
        formattedPrice={formattedPrice}
        handlePriceChange={handlePriceChange}
        addItem={addItem}
        handleKeyDown={handleKeyDown}
      />
      <EditItemModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        errorMessage={errorMessage}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleEditPriceChange={handleEditPriceChange}
        saveEdit={saveEdit}
        editingIndex={editingIndex}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        deleteItem={deleteItem}
      />
      <ConfirmClearListModal
        isOpen={isClearListModalOpen}
        closeModal={() => setIsClearListModalOpen(false)}
        clearList={clearList}
      />
      <SetLimitModal
        isOpen={isLimitModalOpen}
        closeModal={closeModal}
        limitValue={limitValue}
        handleLimitValue={handleLimitValue}
        setLimitValueHandler={setLimitValueHandler}
      />
      <ResetLimitModal
        isOpen={isResetLimitModalOpen}
        closeModal={() => setIsResetLimitModalOpen(false)}
        resetLimitHandler={resetLimitHandler}
      />
    </div>
  );
};

export default App;