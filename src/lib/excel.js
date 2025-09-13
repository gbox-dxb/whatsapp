import * as XLSX from 'xlsx';

export function exportToExcel(orders) {
  if (!orders || orders.length === 0) {
    throw new Error('No orders to export');
  }

  // Prepare data for Excel
  const excelData = orders.map((order, index) => ({
    'S.No': index + 1,
    'Reference': order.ref || '',
    'Date': order.date || '',
    'Customer Name': order.name || '',
    'Mobile Number': order.mobile || '',
    'Address': order.address || '',
    'City': order.city || '',
    'Items': order.items || '',
    'Price': order.price || '',
    'Delivery': order.delivery || '',
    'Total Payment': order.totalPayment || '',
    'Special Note': order.note || '',
    'Parsed At': order.parsedAt ? new Date(order.parsedAt).toLocaleString() : ''
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 8 },   // S.No
    { wch: 15 },  // Reference
    { wch: 12 },  // Date
    { wch: 20 },  // Customer Name
    { wch: 15 },  // Mobile Number
    { wch: 30 },  // Address
    { wch: 15 },  // City
    { wch: 25 },  // Items
    { wch: 12 },  // Price
    { wch: 12 },  // Delivery
    { wch: 15 },  // Total Payment
    { wch: 20 },  // Special Note
    { wch: 18 }   // Parsed At
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'WhatsApp Orders');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const filename = `WhatsApp_Orders_${timestamp}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, filename);
}