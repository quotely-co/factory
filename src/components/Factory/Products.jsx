import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Search, Plus, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ProductModal from "./ProductModal";
import ProductTable from "./ProductTable";

const Products = () => {
  const [showAlert, setShowAlert] = useState(false);
  const HOST = import.meta.env.VITE_HOST_URL;
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    factoryId: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const factoryId = payload.factoryId;

      const res = await axios.get(`${HOST}/api/products?id=${factoryId}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${HOST}/api/products/${id}`);
      fetchProducts();
      toast.success("Product Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingIndex !== null
        ? `${HOST}/api/products/${form.id}`
        : `${HOST}/api/products`;

      const method = editingIndex !== null ? "put" : "post";

      await axios({
        method,
        url: endpoint,
        data: { ...form },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
      toast.success(editingIndex !== null ? "Product updated successfully!" : "Product added successfully!");

      resetForm();
      setIsModalOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An error occurred while saving the product.");
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
      factoryId: ""
    });
  };

  const handleFileUpload = async (file) => {
    if (file) {
      try {
        setIsUploading(true);
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("upload_preset", "WhiteLabel");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/didflfhb4/image/upload",
          cloudinaryFormData
        );

        if (response.data.secure_url) {
          setForm({ ...form, image: response.data.secure_url });
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title">Manage Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {showAlert && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          {editingIndex !== null ? "Product updated successfully!" : "Product added successfully!"}
        </div>
      )}

      <div className="mb-4 flex items-center">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 p-2 rounded-lg border border-[#F1F1F1]"
        />
      </div>

      <ProductTable 
        products={filteredProducts} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />

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

export default Products;