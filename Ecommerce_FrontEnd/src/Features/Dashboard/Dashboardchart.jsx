
"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from '../../api'

export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState("year")
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [topCategories, setTopCategories] = useState([])

  // Colors for charts
  const COLORS = [
    "#3c0366",
    "#005f5a",
    "#a65f00",
    "#ca3500",
    "#c800de",
    "#82CA9D",
    "#F06292",
    "#57534d",
    "#c6005c",
    "#9575CD",
  ]

  useEffect(() => {
    // Fetch sales data
    api.get(`offer/api/sales-data/?filter=${timeFilter}`)
      .then(response => setSalesData(response.data))
      .catch(error => console.error("Error fetching sales data:", error))

    // Fetch top products
    api.get("offer/api/top-products/")
      .then(response => setTopProducts(response.data))
      .catch(error => console.error("Error fetching top products:", error))

    // Fetch top categories
    api.get("offer/api/top-categories/")
      .then(response => setTopCategories(response.data))
      .catch(error => console.error("Error fetching top categories:", error))
  }, [timeFilter])

  // Get the appropriate x-axis key based on the selected time filter
  const getXAxisKey = () => {
    switch (timeFilter) {
      case "year":
        return "month"
      case "month":
        return "week"
      case "week":
        return "day"
      case "today":
        return "hour"
      default:
        return "month"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#7a2828]">Admin Dashboard</h1>

      {/* Time filter buttons */}
      <div className="flex gap-2 mb-6">
        <Button variant={timeFilter === "today" ? "default" : "outline"} onClick={() => setTimeFilter("today")}>
          Today
        </Button>
        <Button variant={timeFilter === "week" ? "default" : "outline"} onClick={() => setTimeFilter("week")}>
          This Week
        </Button>
        <Button variant={timeFilter === "month" ? "default" : "outline"} onClick={() => setTimeFilter("month")}>
          This Month
        </Button>
        <Button variant={timeFilter === "year" ? "default" : "outline"} onClick={() => setTimeFilter("year")}>
          This Year
        </Button>
      </div>

      {/* Sales Chart */}
      <Card className="mb-6 ">
        <CardHeader>
          <CardTitle>
            {timeFilter === "year" && "Yearly Sales"}
            {timeFilter === "month" && "Monthly Sales"}
            {timeFilter === "week" && "Weekly Sales"}
            {timeFilter === "today" && "Today's Sales"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "#d08700",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={getXAxisKey()} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" formatter={(value) => `₹${value}`} />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 10 Best-Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Best-Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `${value}`} />
                    <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                    <ChartTooltip cursor={false} formatter={(value) => [`${value} units`, "Sales"]} />
                    <Bar dataKey="sales" radius={4}>
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-2">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span>{product.name}</span>
                      <span className="font-medium">{product.sales} sold</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top 10 Best-Selling Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Best-Selling Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="sales"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip formatter={(value) => `${value} units`} />
                  </PieChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-2">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.sales} sold</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
