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

export const getLimit = () => {
    const savedLimit = localStorage.getItem('limit');
    return savedLimit ? parseFloat(savedLimit) : null;
};

export const saveLimit = (limit) => {
    localStorage.setItem('limit', limit);
};

export const removeLimit = () => {
    localStorage.removeItem('limit');
};