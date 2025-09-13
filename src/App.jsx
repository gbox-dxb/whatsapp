import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MessageSquare, Download, Database, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { parseWhatsAppMessages } from '@/lib/parser';
import { exportToExcel } from '@/lib/excel';
import { saveToDatabase, getFromDatabase, clearDatabase } from '@/lib/database';
import OrderTable from '@/components/OrderTable';

function App() {
  const [inputText, setInputText] = useState('');
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStoredOrders();
  }, []);

  const loadStoredOrders = () => {
    const stored = getFromDatabase();
    setAllOrders(stored);
  };

  const handleParse = () => {
    if (!inputText.trim()) {
      toast({
        title: "⚠️ Empty Input",
        description: "Please paste some WhatsApp messages to parse!",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedOrders = parseWhatsAppMessages(inputText);
      
      if (parsedOrders.length === 0) {
        toast({
          title: "🔍 No Orders Found",
          description: "No valid order messages found in the text. Please check the format!",
          variant: "destructive"
        });
        return;
      }

      setOrders(parsedOrders);
      
      // Save to database
      const savedOrders = saveToDatabase(parsedOrders);
      setAllOrders(savedOrders);

      toast({
        title: "✅ Success!",
        description: `Parsed ${parsedOrders.length} order(s) successfully!`
      });

    } catch (error) {
      toast({
        title: "❌ Parse Error",
        description: "Failed to parse messages. Please check the format!",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    const ordersToExport = showAllOrders ? allOrders : orders;
    
    if (ordersToExport.length === 0) {
      toast({
        title: "⚠️ No Data",
        description: "No orders to export. Parse some messages first!",
        variant: "destructive"
      });
      return;
    }

    try {
      exportToExcel(ordersToExport);
      toast({
        title: "📊 Excel Exported!",
        description: `Successfully exported ${ordersToExport.length} orders to Excel!`
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Failed to export to Excel. Please try again!",
        variant: "destructive"
      });
    }
  };

  const handleClearDatabase = () => {
    clearDatabase();
    setAllOrders([]);
    setOrders([]);
    toast({
      title: "🗑️ Database Cleared",
      description: "All stored orders have been removed!"
    });
  };

  const toggleView = () => {
    setShowAllOrders(!showAllOrders);
  };

  const displayOrders = showAllOrders ? allOrders : orders;

  return (
    <>
      <Helmet>
        <title>G-BOX | WhatsApp Order Parser</title>
        <meta name="description" content="Parse WhatsApp order messages and export to Excel with database storage" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                WhatsApp Order Parser
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Extract order data from WhatsApp messages and export to Excel with database storage
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Paste WhatsApp Messages
                </h2>
                <Textarea
                  placeholder="Paste your WhatsApp order messages here...

Example format:
Ref# WTSP-3401- 13/09/25 - KF
Thanks For Online Shopping
Your order is Successfully Placed
Name   :   John Doe
Mobile  :   +1234567890
Address  :   123 Main Street
City    :   New York
Item(s)   :   Product Name
Price   :   $99.99
Delivery:   $5.00
TOTAL PAYMENT:   $104.99
Special Note :   Handle with care"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder-gray-400 resize-none"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={handleParse}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-6 py-2"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Parse Messages
                  </Button>
                  <Button 
                    onClick={() => setInputText('')}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Clear Input
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Button 
              onClick={handleExportExcel}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button 
              onClick={toggleView}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showAllOrders ? 'Show Current Session' : 'Show All Stored Orders'}
            </Button>
            <Button 
              onClick={handleClearDatabase}
              variant="outline"
              className="border-red-400/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Database
            </Button>
          </motion.div>

          {/* Stats */}
          {(orders.length > 0 || allOrders.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{orders.length}</div>
                  <div className="text-sm text-gray-300">Current Session</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{allOrders.length}</div>
                  <div className="text-sm text-gray-300">Total Stored</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{displayOrders.length}</div>
                  <div className="text-sm text-gray-300">Currently Viewing</div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Orders Table */}
          {displayOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-semibold text-white">
                    {showAllOrders ? 'All Stored Orders' : 'Parsed Orders'}
                  </h2>
                </div>
                <OrderTable orders={displayOrders} />
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {displayOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400">Paste some WhatsApp messages above to get started!</p>
            </motion.div>
          )}

        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;