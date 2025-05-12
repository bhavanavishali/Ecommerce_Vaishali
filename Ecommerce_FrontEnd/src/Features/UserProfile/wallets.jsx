

import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '../../api';
import { useLocation } from "react-router-dom";

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchWalletData = async () => {
    try {
      const walletResponse = await api.get("cartapp/wallet/");
      setBalance(parseFloat(walletResponse.data.data.balance) || 0);

      const transactionResponse = await api.get("cartapp/wallet/transactions/");
      setTransactions(transactionResponse.data.data);
      console.log("Transactions:", transactionResponse.data.data); // Debug log
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch wallet data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [location]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Wallet</CardTitle>
        <CardDescription>Manage your wallet balance and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-[#7a2828] to-red-200 rounded-lg p-6 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Available Balance</p>
              <h2 className="text-3xl font-bold mt-1">₹{balance.toFixed(2)}</h2>
            </div>
            <CreditCard className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="credit">Added</TabsTrigger>
            <TabsTrigger value="debit">Spent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.transaction_type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                      {transaction.transaction_type === "credit" ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.order_number ? `Order #${transaction.order_number}` : transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.transaction_type === "credit" ? "+" : "-"}₹
                    {(parseFloat(transaction.amount) || 0).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            {transactions.filter((t) => t.transaction_type === "credit").length === 0 ? (
              <p className="text-center text-gray-500">No credit transactions</p>
            ) : (
              transactions
                .filter((t) => t.transaction_type === "credit")
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.order_number ? `Order #${transaction.order_number}` : transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-green-600">
                      +₹{(parseFloat(transaction.amount) || 0).toFixed(2)}
                    </p>
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="debit" className="space-y-4">
            {transactions.filter((t) => t.transaction_type === "debit").length === 0 ? (
              <p className="text-center text-gray-500">No debit transactions</p>
            ) : (
              transactions
                .filter((t) => t.transaction_type === "debit")
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-100">
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.order_number ? `Order #${transaction.order_number}` : transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-red-600">
                      -₹{(parseFloat(transaction.amount) || 0).toFixed(2)}
                    </p>
                  </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WalletPage;