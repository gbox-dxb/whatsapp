export function parseWhatsAppMessages(text) {
  const orders = [];
  
  // Split by potential message boundaries (looking for Ref# patterns)
  const messageBlocks = text.split(/(?=Ref#)/g).filter(block => block.trim());
  
  messageBlocks.forEach((block, index) => {
    try {
      const order = parseOrderBlock(block, index);
      if (order) {
        orders.push(order);
      }
    } catch (error) {
      console.warn('Failed to parse order block:', error);
    }
  });
  
  return orders;
}

function parseOrderBlock(block, index) {
  const lines = block.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  // Initialize order object
  const order = {
    id: `order_${Date.now()}_${index}`,
    ref: '',
    date: '',
    name: '',
    mobile: '',
    address: '',
    city: '',
    items: '',
    price: '',
    delivery: '',
    totalPayment: '',
    note: '',
    parsedAt: new Date().toISOString()
  };
  
  // Parse first line for Ref# and date
  const firstLine = lines[0];
  
  // Regex to capture parts around the date: Ref# (part1) - (date) - (part2)
  const refWithDateMatch = firstLine.match(/Ref#\s*(.*?)\s*-\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*-\s*(.*)/i);

  if (refWithDateMatch) {
    const part1 = refWithDateMatch[1].trim();
    const datePart = refWithDateMatch[2].trim();
    const part2 = refWithDateMatch[3].trim();
    
    order.date = datePart;
    order.ref = `${part1}${part2}`.replace(/-\s*$/, '').trim(); // Combine and clean up trailing hyphen
  } else {
    // Fallback for Ref# lines without a date in the middle
    const dateMatch = firstLine.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
    if (dateMatch) {
      order.date = dateMatch[1].trim();
    }
    
    const refMatch = firstLine.match(/Ref#\s*(.+)/i);
    if (refMatch) {
      let refStr = refMatch[1].trim();
      if (order.date) {
        // Remove date and surrounding hyphens from the ref string if found
        refStr = refStr.replace(new RegExp(`\\s*-\\s*${order.date.replace(/\//g, '\\/')}\\s*`), ' ');
      }
      order.ref = refStr.replace(/\s+/g, ' ').trim();
    }
  }
  
  // Parse other fields
  lines.forEach(line => {
    const cleanLine = line.replace(/\s+/g, ' ').trim();
    
    // Name
    const nameMatch = cleanLine.match(/Name\s*:+\s*(.+)/i);
    if (nameMatch) {
      order.name = nameMatch[1].trim();
      return;
    }
    
    // Mobile
    const mobileMatch = cleanLine.match(/Mobile\s*:+\s*(.+)/i);
    if (mobileMatch) {
      order.mobile = mobileMatch[1].trim();
      return;
    }
    
    // Address
    const addressMatch = cleanLine.match(/Address\s*:+\s*(.+)/i);
    if (addressMatch) {
      order.address = addressMatch[1].trim();
      return;
    }
    
    // City
    const cityMatch = cleanLine.match(/City\s*:+\s*(.+)/i);
    if (cityMatch) {
      order.city = cityMatch[1].trim();
      return;
    }
    
    // Items
    const itemsMatch = cleanLine.match(/Item\(?s?\)?\s*:+\s*(.+)/i);
    if (itemsMatch) {
      order.items = itemsMatch[1].trim();
      return;
    }
    
    // Price
    const priceMatch = cleanLine.match(/Price\s*:+\s*(.+)/i);
    if (priceMatch) {
      order.price = priceMatch[1].trim();
      return;
    }
    
    // Delivery
    const deliveryMatch = cleanLine.match(/Delivery\s*:+\s*(.+)/i);
    if (deliveryMatch) {
      order.delivery = deliveryMatch[1].trim();
      return;
    }

    // TOTAL PAYMENT
    const totalPaymentMatch = cleanLine.match(/TOTAL\s+PAYMENT\s*:+\s*(.+)/i);
    if (totalPaymentMatch) {
        order.totalPayment = totalPaymentMatch[1].trim();
        return;
    }
    
    // Special Note
const noteMatch = cleanLine.match(/(?:important\s+Note\s*:+\s*(.+)|Special\s+Note\s*:+\s*(.+))/i);

if (noteMatch) {
  // If "important note" matched, it will be in group 1
  // If "Special Note" matched, it will be in group 2
  order.note = (noteMatch[1] || noteMatch[2]).trim();
  return;
}
  });
  
  // Validate that we have at least some essential fields
  if (!order.ref && !order.name && !order.mobile) {
    return null;
  }
  
  return order;
}