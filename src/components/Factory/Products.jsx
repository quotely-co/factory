import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Search, Plus, LogIn, Package, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProductModal from "./ProductModal";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import useSubdomainValidation from "@/hooks/useSubdomainValidation";

const VendorProducts = () => {
  const { isValidSubdomain, subdomain } = useSubdomainValidation();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    moq: "",
    description: "",
    category: "",
    leadTime: "",
    unit: "pcs",
    image: "",
    increment: "",
    variations: [{ size: "", basePrice: "" }],
    fees: [{ name: "", amount: "" }],
    cbmRates: [{ quantity: "", cbm: "" }],
    specifications: {
      length: "",
      width: "",
      height: "",
      capacity: "",
      materialType: "",
      gsm: "",
      colorOptions: [],
      printingTechnique: "",
      customFinish: ""
    },
    factoryId: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const HOST = import.meta.env.VITE_HOST_URL || "https://api.quotely.shop";

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Verify token format
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          setIsAuthenticated(true);
          fetchProducts(token);
        } else {
          handleInvalidToken();
        }
      } catch (error) {
        handleInvalidToken();
      }
    } else {
      setIsAuthenticated(false);
      // Fetch products for public view when not authenticated
      fetchPublicProducts();
    }
    setIsLoading(false);
  };

  const handleInvalidToken = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.error("Your session has expired. Please log in again.");
    // After removing invalid token, fetch public products
    fetchPublicProducts();
  };

  // New function to fetch public products
  const fetchPublicProducts = async () => {
    try {
      setIsLoading(true);
      // Using the HOST variable instead of hardcoded URL
      const res = await axios.get(`${HOST}/api/products?shopname=${subdomain}`);
      console.log(res);
    
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch public products:", error);
      toast.error("Failed to load products. Please try again.");
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (token) => {
    try {
      setIsLoading(true);
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const factoryId = payload.factoryId;

      if (!factoryId) {
        throw new Error("Factory ID not found in token");
      }

      // Using the HOST variable instead of hardcoded URL
      const res = await axios.get(`${HOST}/api/products`, {
        params: { id: factoryId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (error.response && error.response.status === 401) {
        handleInvalidToken();
      } else {
        toast.error("Failed to load products. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    // Ensure the product has a specifications field
    const productToEdit = {
      ...products[index],
      specifications: products[index].specifications || {
        length: "",
        width: "",
        height: "",
        capacity: "",
        materialType: "",
        gsm: "",
        colorOptions: [],
        printingTechnique: "",
        customFinish: ""
      }
    };
    
    setForm(productToEdit);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${HOST}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product deleted successfully");
      fetchProducts(token);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    try {
      const endpoint = editingIndex !== null
        ? `${HOST}/api/products/${form.id}`
        : `${HOST}/api/products`;

      const method = editingIndex !== null ? "put" : "post";

      // Get factory ID from token
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const factoryId = payload.factoryId;

      // Add factoryId to form data
      const productData = {
        ...form,
        factoryId: factoryId
      };

      await axios({
        method,
        url: endpoint,
        data: productData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      fetchProducts(token);
      toast.success(editingIndex !== null ? "Product updated successfully!" : "Product added successfully!");
      resetForm();
      setIsModalOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving product:", error);

      if (error.response) {
        // Handle specific error messages from the server
        const errorMsg = error.response.data.message || "An error occurred while saving the product.";
        toast.error(errorMsg);
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      moq: "",
      description: "",
      category: "",
      leadTime: "",
      unit: "pcs",
      image: "",
      increment: "",
      variations: [{ size: "", basePrice: "" }],
      fees: [{ name: "", amount: "" }],
      cbmRates: [{ quantity: "", cbm: "" }],
      specifications: {
        length: "",
        width: "",
        height: "",
        capacity: "",
        materialType: "",
        gsm: "",
        colorOptions: [],
        printingTechnique: "",
        customFinish: ""
      },
      factoryId: ""
    });
  };

  const handleFileUpload = async (file) => {
    if (file) {
      try {
        setIsUploading(true);

        // Check file size before uploading (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File is too large. Maximum file size is 5MB.");
          setIsUploading(false);
          return;
        }

        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("upload_preset", "WhiteLabel");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/didflfhb4/image/upload",
          cloudinaryFormData
        );

        if (response.data.secure_url) {
          setForm({ ...form, image: response.data.secure_url });
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleLogin = () => {
    window.location.href = "https://quotely.shop/factory/login";
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.specifications?.materialType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get base price from variations or fees
  const getBasePrice = (product) => {
  
    if (product.variations && product.variations.length > 0 && product.variations[0].basePrice) {
      return parseFloat(product.variations[0].basePrice).toFixed(2);
    } else if (product.fees && product.fees.length > 0 && product.fees[0].amount) {
      return parseFloat(product.fees[0].amount).toFixed(2);
    } else {
      return "Contact for pricing";
    }
  };

  // Get product specifications summary
  const getSpecsSummary = (product) => {
    const specs = product.specifications || {};
    const parts = [];
    
    if (specs.materialType) parts.push(specs.materialType);
    if (specs.gsm) parts.push(`${specs.gsm}gsm`);
    
    return parts.length > 0 ? parts.join(', ') : "Specifications not available";
  };

  // Public View - User can see products without being logged in
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>
            <p className="text-gray-600">Browse our available factory products</p>
          </div>
          <button
            onClick={handleLogin}
            className="mt-3 sm:mt-0 py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center"
          >
            <LogIn size={18} className="mr-2" />
            Login as Factory
          </button>
        </div>

        <div className="mb-4 flex items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <Package size={40} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No Products Available</h3>
            <p className="text-gray-500">Check back later for our product catalog</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div key={product._id || index} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-100 hover:cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Package size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {product.category || "Uncategorized"}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {product.description || "No description available"}
                  </p>

                  <div className="mt-2 text-xs text-gray-500">
                    {getSpecsSummary(product)}
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="font-medium text-gray-900">
                      ${getBasePrice(product)}
                      <span className="text-xs text-gray-500 ml-1">/ {product.unit || "unit"}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      MOQ: {product.moq || "1"} {product.unit || "pcs"}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Lead time: {product.leadTime || "Contact for details"} days
                    </span>
                    <button
                      onClick={handleLogin}
                      className="py-1 px-3 bg-primary/10 text-primary text-sm rounded hover:bg-primary/20 transition-colors"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show product management interface if authenticated
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 bg-primary text-white rounded-lg flex items-center hover:cursor-pointer"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg border border-gray-200"
          />
        </div>
      </div>

      {products.length === 0 && !isLoading ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <Package size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No Products Yet</h3>
          <p className="text-gray-500 mb-4">Start building your product catalog</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 bg-primary text-white rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProductModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          form={form}
          setForm={setForm}
          editingIndex={editingIndex}
          handleSubmit={handleSubmit}
          isUploading={isUploading}
          handleFileUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default VendorProducts;