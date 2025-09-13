import React from 'react';
import { motion } from 'framer-motion';

const OrderTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left p-3 text-white font-semibold">Ref#</th>
            <th className="text-left p-3 text-white font-semibold">Date</th>
            <th className="text-left p-3 text-white font-semibold">Name</th>
            <th className="text-left p-3 text-white font-semibold">Mobile</th>
            <th className="text-left p-3 text-white font-semibold">City</th>
            <th className="text-left p-3 text-white font-semibold">Item(s)</th>
            <th className="text-left p-3 text-white font-semibold">Price</th>
            <th className="text-left p-3 text-white font-semibold">Delivery</th>
            <th className="text-left p-3 text-white font-semibold">Total Payment</th>
            <th className="text-left p-3 text-white font-semibold">Note</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border-b border-white/10 hover:bg-white/5 transition-colors"
            >
              <td className="p-3 text-gray-300">{order.ref}</td>
              <td className="p-3 text-gray-300">{order.date}</td>
              <td className="p-3 text-white font-medium">{order.name}</td>
              <td className="p-3 text-gray-300">{order.mobile}</td>
              <td className="p-3 text-gray-300">{order.city}</td>
              <td className="p-3 text-gray-300 max-w-xs truncate" title={order.items}>
                {order.items}
              </td>
              <td className="p-3 text-gray-300">{order.price}</td>
              <td className="p-3 text-gray-300">{order.delivery}</td>
              <td className="p-3 text-green-400 font-semibold">{order.totalPayment}</td>
              <td className="p-3 text-gray-300">{order.note}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
