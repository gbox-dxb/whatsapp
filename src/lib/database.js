const STORAGE_KEY = 'whatsapp_orders';

export function saveToDatabase(newOrders) {
  try {
    const existingOrders = getFromDatabase();
    const allOrders = [...existingOrders, ...newOrders];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allOrders));
    return allOrders;
  } catch (error) {
    console.error('Failed to save to database:', error);
    throw new Error('Failed to save orders to database');
  }
}

export function getFromDatabase() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load from database:', error);
    return [];
  }
}

export function clearDatabase() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw new Error('Failed to clear database');
  }
}

export function updateOrderInDatabase(orderId, updatedOrder) {
  try {
    const orders = getFromDatabase();
    const index = orders.findIndex(order => order.id === orderId);
    
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedOrder };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      return orders;
    }
    
    throw new Error('Order not found');
  } catch (error) {
    console.error('Failed to update order:', error);
    throw new Error('Failed to update order in database');
  }
}

export function deleteOrderFromDatabase(orderId) {
  try {
    const orders = getFromDatabase();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredOrders));
    return filteredOrders;
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw new Error('Failed to delete order from database');
  }
}