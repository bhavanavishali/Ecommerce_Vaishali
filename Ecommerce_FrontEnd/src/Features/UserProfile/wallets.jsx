// import { CreditCard, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const WalletPage = () => {
//   // Sample wallet data
//   const balance = 1250.75

//   // Sample transaction data
//   const transactions = [
//     {
//       id: 1,
//       type: "credit",
//       amount: 500.0,
//       date: "Mar 29, 2025",
//       description: "Refund for Order #ORD-12342",
//     },
//     {
//       id: 2,
//       type: "debit",
//       amount: 129.99,
//       date: "Mar 28, 2025",
//       description: "Payment for Order #ORD-12345",
//     },
//     {
//       id: 3,
//       type: "credit",
//       amount: 1000.0,
//       date: "Mar 15, 2025",
//       description: "Added money to wallet",
//     },
//     {
//       id: 4,
//       type: "debit",
//       amount: 119.26,
//       date: "Mar 10, 2025",
//       description: "Payment for Order #ORD-12340",
//     },
//   ]

//   return (
//     <Card className="max-w-3xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold">Wallet</CardTitle>
//         <CardDescription>Manage your wallet balance and transactions</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="bg-gradient-to-r from-[#7a2828] to-red-200 rounded-lg p-6 text-white mb-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm opacity-80">Available Balance</p>
//               <h2 className="text-3xl font-bold mt-1">₹{balance.toFixed(2)}</h2>
//             </div>
//             <CreditCard className="h-8 w-8 opacity-80" />
//           </div>
//           <div className="mt-6 flex gap-3">
//             <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
//               <Plus className="mr-1 h-4 w-4" /> Add Money
//             </Button>
//             <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
//               Withdraw
//             </Button>
//           </div>
//         </div>

//         <Tabs defaultValue="all">
//           <TabsList className="mb-4">
//             <TabsTrigger value="all">All Transactions</TabsTrigger>
//             <TabsTrigger value="credit">Added</TabsTrigger>
//             <TabsTrigger value="debit">Spent</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all" className="space-y-4">
//             {transactions.map((transaction) => (
//               <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
//                     {transaction.type === "credit" ? (
//                       <ArrowDownRight className={`h-5 w-5 text-green-600`} />
//                     ) : (
//                       <ArrowUpRight className={`h-5 w-5 text-red-600`} />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium">{transaction.description}</p>
//                     <p className="text-sm text-gray-500">{transaction.date}</p>
//                   </div>
//                 </div>
//                 <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
//                   {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
//                 </p>
//               </div>
//             ))}
//           </TabsContent>

//           <TabsContent value="credit" className="space-y-4">
//             {transactions
//               .filter((t) => t.type === "credit")
//               .map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-full bg-green-100">
//                       <ArrowDownRight className="h-5 w-5 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-gray-500">{transaction.date}</p>
//                     </div>
//                   </div>
//                   <p className="font-medium text-green-600">+₹{transaction.amount.toFixed(2)}</p>
//                 </div>
//               ))}
//           </TabsContent>

//           <TabsContent value="debit" className="space-y-4">
//             {transactions
//               .filter((t) => t.type === "debit")
//               .map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-full bg-red-100">
//                       <ArrowUpRight className="h-5 w-5 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-gray-500">{transaction.date}</p>
//                     </div>
//                   </div>
//                   <p className="font-medium text-red-600">-₹{transaction.amount.toFixed(2)}</p>
//                 </div>
//               ))}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }

// export default WalletPage


// import { useState, useEffect } from "react";
// import { CreditCard, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import api from '../../api';

// const WalletPage = () => {
//   const [balance, setBalance] = useState(0); // Initialize balance
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch wallet and transactions when component mounts
//   useEffect(() => {
//     const fetchWalletData = async () => {
//       try {
//         // Fetch wallet balance
//         const walletResponse = await api.get("cartapp/wallet/");
//         setBalance(parseFloat(walletResponse.data.data.balance) || 0); // Convert to number

//         // Fetch transaction history
//         const transactionResponse = await api.get("cartapp/wallet/transactions/");
//         setTransactions(transactionResponse.data.data);
//       } catch (err) {
//         setError("Failed to fetch wallet data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWalletData();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <Card className="max-w-3xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold">Wallet</CardTitle>
//         <CardDescription>Manage your wallet balance and transactions</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="bg-gradient-to-r from-[#7a2828] to-red-200 rounded-lg p-6 text-white mb-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm opacity-80">Available Balance</p>
//               <h2 className="text-3xl font-bold mt-1">₹{balance.toFixed(2)}</h2>
//             </div>
//             <CreditCard className="h-8 w-8 opacity-80" />
//           </div>
//           <div className="mt-6 flex gap-3">
            
//             <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
//               Withdraw
//             </Button>
//           </div>
//         </div>

//         <Tabs defaultValue="all">
//           <TabsList className="mb-4">
//             <TabsTrigger value="all">All Transactions</TabsTrigger>
//             <TabsTrigger value="credit">Added</TabsTrigger>
//             <TabsTrigger value="debit">Spent</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all" className="space-y-4">
//             {transactions.map((transaction) => (
//               <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-2 rounded-full ${transaction.transaction_type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
//                     {transaction.transaction_type === "credit" ? (
//                       <ArrowDownRight className="h-5 w-5 text-green-600" />
//                     ) : (
//                       <ArrowUpRight className="h-5 w-5 text-red-600" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium">{transaction.description}</p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(transaction.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <p
//                   className={`font-medium ${
//                     transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {transaction.transaction_type === "credit" ? "+" : "-"}₹
//                   {(parseFloat(transaction.amount) || 0).toFixed(2)}
//                 </p>
//               </div>
//             ))}
//           </TabsContent>

//           <TabsContent value="credit" className="space-y-4">
//             {transactions
//               .filter((t) => t.transaction_type === "credit")
//               .map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-full bg-green-100">
//                       <ArrowDownRight className="h-5 w-5 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(transaction.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-medium text-green-600">
//                     +₹{(parseFloat(transaction.amount) || 0).toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//           </TabsContent>

//           <TabsContent value="debit" className="space-y-4">
//             {transactions
//               .filter((t) => t.transaction_type === "debit")
//               .map((transaction) => (
//                 <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-full bg-red-100">
//                       <ArrowUpRight className="h-5 w-5 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{transaction.description}</p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(transaction.created_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="font-medium text-red-600">
//                     -₹{(parseFloat(transaction.amount) || 0).toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default WalletPage;

import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from '../../api';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Fetch wallet balance
        const walletResponse = await api.get("cartapp/wallet/");
        setBalance(parseFloat(walletResponse.data.data.balance) || 0);

        // Fetch transaction history
        const transactionResponse = await api.get("cartapp/wallet/transactions/");
        setTransactions(transactionResponse.data.data);
      } catch (err) {
        setError("Failed to fetch wallet data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

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
                        {transaction.description}
                        {transaction.order_number && ` (Order #${transaction.order_number})`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  |</div>
                  <p
                    className={`font-medium ${
                      transaction.transaction_type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
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
                          {transaction.description}
                          {transaction.order_number && ` (Order #${transaction.order_number})`}
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
                          {transaction.description}
                          {transaction.order_number && ` (Order #${transaction.order_number})`}
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