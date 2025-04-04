import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Search, Plus, X, Image, PlusCircle, MinusCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";


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
    factoryId: "" // You'll need to populate this with available factories
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));

        const factoryId = payload.factoryId

        const res = await axios.get(`${HOST}/api/products?id=${factoryId}`);

        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const handleAddVariation = () => {
    setForm({
      ...form,
      variations: [...form.variations, { size: "", basePrice: "" }]
    });
  };

  const handleRemoveVariation = (index) => {
    setForm({
      ...form,
      variations: form.variations.filter((_, i) => i !== index)
    });
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...form.variations];
    newVariations[index][field] = value;
    setForm({ ...form, variations: newVariations });
  };

  const handleAddFee = () => {
    setForm({
      ...form,
      fees: [...form.fees, { name: "", amount: "" }]
    });
  };

  const handleRemoveFee = (index) => {
    setForm({
      ...form,
      fees: form.fees.filter((_, i) => i !== index)
    });
  };

  const handleFeeChange = (index, field, value) => {
    const newFees = [...form.fees];
    newFees[index][field] = value;
    setForm({ ...form, fees: newFees });
  };

  const handleAddCbmRate = () => {
    setForm({
      ...form,
      cbmRates: [...form.cbmRates, { quantity: "", cbm: "" }]
    });
  };

  const handleRemoveCbmRate = (index) => {
    setForm({
      ...form,
      cbmRates: form.cbmRates.filter((_, i) => i !== index)
    });
  };

  const handleCbmRateChange = (index, field, value) => {
    const newCbmRates = [...form.cbmRates];
    newCbmRates[index][field] = value;
    setForm({ ...form, cbmRates: newCbmRates });
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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    await handleFileUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
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

      // Refetch products
      const updatedProducts = await axios.get(`${HOST}/api/products`);
      setProducts(updatedProducts.data);

      toast.success(editingIndex !== null ? "Product updated successfully!" : "Product added successfully!");

      setForm({
        name: "",
        price: "",
        moq: "",
        description: "",
        category: "",
        leadTime: "",
        unit: "pcs",
        image: "",
        increment: "", // Add this
        variations: [{ size: "", basePrice: "" }], // Add this
        fees: [{ name: "", amount: "" }], // Add this
        cbmRates: [{ quantity: "", cbm: "" }], // Add this
        factoryId: "" // Add this
      });
      setIsModalOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An error occurred while saving the product.");
    }
  };


  const handleEdit = (index) => {
    setForm(products[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${HOST}/api/products/${id}`);
      const updatedProducts = await axios.get(`${HOST}/api/products`);
      setProducts(updatedProducts.data);
      toast.success("Product Deteled Succesfully")
    } catch (error) {
      console.log(error);

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

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-3xl border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-medium">Image</th>
              <th className="p-4 text-left font-medium">Name</th>
              <th className="p-4 text-left font-medium">Category</th>
              <th className="p-4 text-left font-medium">Price(min)</th>
              <th className="p-4 text-left font-medium">MOQ</th>
              <th className="p-4 text-left font-medium">Lead Time</th>
              <th className="p-4 text-left font-medium">Description</th>
              <th className="p-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image size={24} className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4"><span className="tag">{product.category}</span></td>
                <td className="p-4">${product.fees[0].amount}</td>
                <td className="p-4">{product.moq} {product.unit}</td>
                <td className="p-4">{product.leadTime} days</td>
                <td className="p-4">
                  {product.description.length > 50
                    ? product.description.slice(0, 50) + "..."
                    : product.description}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="btn btn-text p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-text p-1 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingIndex !== null ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-text">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      {form.image ? (
                        <div className="relative">
                          <img
                            src={form.image}
                            alt="Product preview"
                            className="h-32 w-32 object-cover rounded-lg mb-2"
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, image: "" })}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Image size={32} className="text-gray-400 mb-2" />
                          <label className="cursor-pointer">
                            <span className="text-black font-medium hover:underline">Upload Image</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*"
                              disabled={isUploading}
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                      {isUploading && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                          <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter product name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#F1F1F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      required
                      placeholder="Product category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#F1F1F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">MOQ (Minimum Order Quantity)</label>
                    <div className="flex">
                      <input
                        type="number"
                        required
                        placeholder="Enter MOQ"
                        value={form.moq}
                        onChange={(e) => setForm({ ...form, moq: e.target.value })}
                        className="w-full p-2 rounded-l-lg border border-[#F1F1F1]"
                      />
                      <select
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="border border-l-0 border-[#F1F1F1] rounded-r-lg px-3"
                      >
                        <option value="pcs">PCS</option>
                        <option value="kg">KG</option>
                        <option value="sets">Sets</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Increment</label>
                    <input
                      type="number"
                      required
                      placeholder="Order increment value"
                      value={form.increment}
                      onChange={(e) => setForm({ ...form, increment: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#F1F1F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Lead Time (Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="Production lead time"
                      value={form.leadTime}
                      onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#F1F1F1]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      placeholder="Product description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#F1F1F1]"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Variations Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Size Variations</h3>
                    <button
                      type="button"
                      onClick={handleAddVariation}
                      className="btn btn-text flex items-center"
                    >
                      <PlusCircle size={18} className="mr-1" />
                      Add Variation
                    </button>
                  </div>
                  {form.variations.map((variation, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Size"
                        value={variation.size}
                        onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <input
                        type="number"
                        placeholder="Base Price"
                        value={variation.basePrice}
                        onChange={(e) => handleVariationChange(index, 'basePrice', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(index)}
                        className="btn btn-text text-red-500"
                      >
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Fees Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Additional Fees</h3>
                    <button
                      type="button"
                      onClick={handleAddFee}
                      className="btn btn-text flex items-center"
                    >
                      <PlusCircle size={18} className="mr-1" />
                      Add Fee
                    </button>
                  </div>
                  {form.fees.map((fee, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Fee Name"
                        value={fee.name}
                        onChange={(e) => handleFeeChange(index, 'name', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={fee.amount}
                        onChange={(e) => handleFeeChange(index, 'amount', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFee(index)}
                        className="btn btn-text text-red-500"
                      >
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* CBM Rates Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">CBM Rates</h3>
                    <button
                      type="button"
                      onClick={handleAddCbmRate}
                      className="btn btn-text flex items-center"
                    >
                      <PlusCircle size={18} className="mr-1" />
                      Add CBM Rate
                    </button>
                  </div>
                  {form.cbmRates.map((rate, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={rate.quantity}
                        onChange={(e) => handleCbmRateChange(index, 'quantity', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <input
                        type="number"
                        placeholder="CBM"
                        value={rate.cbm}
                        onChange={(e) => handleCbmRateChange(index, 'cbm', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-[#F1F1F1]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCbmRate(index)}
                        className="btn btn-text text-red-500"
                      >
                        <MinusCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-text"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingIndex !== null ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;