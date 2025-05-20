

"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pencil, Plus, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "../../api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("productapp/products/");
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (productId, currentIsActive) => {
    try {
      await api.patch(`productapp/products/${productId}/`, { is_active: !currentIsActive });
      setProducts(products.map((product) =>
        product.id === productId ? { ...product, is_active: !currentIsActive } : product
      ));
    } catch (err) {
      console.error("Error updating product status:", err);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toString().includes(searchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productsPerPage = 7;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              className="bg-[#8B1D24] hover:bg-[#6B171C] text-white flex items-center gap-2"
              onClick={() => navigate("/addproduct")}
            >
              <span className="text-sm font-medium">ADD NEW PRODUCT</span>
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B1D24]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            Error loading products: {error}
            <Button
              className="ml-4 bg-[#8B1D24] hover:bg-[#6B171C] text-white text-xs px-2 py-1"
              onClick={fetchProducts}
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium">Item ID</TableHead>
                  <TableHead className="font-medium">Item Name</TableHead>
                  <TableHead className="font-medium">Category</TableHead>
                  <TableHead className="font-medium">Availability</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <TableRow key={product.id} className="border-t">
                      <TableCell className="py-4">{product.id}</TableCell>
                      <TableCell className="py-4">{product.name}</TableCell>
                      <TableCell className="py-4">{product.category_name}</TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.available ? "In Stock" : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active ? "Active" : "Blocked"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActiveStatus(product.id, product.is_active)}
                            title={product.is_active ? "Block Product" : "Unblock Product"}
                          >
                            {product.is_active ? (
                              <Lock className="h-4 w-4 text-red-600" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/editproduct/${product.id}`)}
                            title="Edit Product"
                          >
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/addvariant/${product.id}`)}
                            title="Add Variant"
                          >
                            <Plus className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
              {pageNumbers.map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    isActive={currentPage === number}
                    onClick={() => handlePageChange(number)}
                    className="cursor-pointer"
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}