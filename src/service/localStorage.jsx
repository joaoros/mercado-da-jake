export const getShoppingList = () => {
    const savedItems = localStorage.getItem('shoppingList');
    return savedItems ? JSON.parse(savedItems) : [];
};
  
export const saveShoppingList = (items) => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
};

export const removeShoppingList = () => {
    localStorage.removeItem('shoppingList');
};