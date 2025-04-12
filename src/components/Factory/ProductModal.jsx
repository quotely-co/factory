import React from "react";
import { X, Image, PlusCircle, MinusCircle } from "lucide-react";

const ProductModal = ({
  isModalOpen,
  setIsModalOpen,
  form,
  setForm,
  editingIndex,
  handleSubmit,
  isUploading,
  handleFileUpload
}) => {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    await handleFileUpload(file);
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
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
            <VariationsSection 
              variations={form.variations}
              handleAddVariation={handleAddVariation}
              handleRemoveVariation={handleRemoveVariation}
              handleVariationChange={handleVariationChange}
            />

            {/* Fees Section */}
            <FeesSection 
              fees={form.fees}
              handleAddFee={handleAddFee}
              handleRemoveFee={handleRemoveFee}
              handleFeeChange={handleFeeChange}
            />

            {/* CBM Rates Section */}
            <CBMRatesSection 
              cbmRates={form.cbmRates}
              handleAddCbmRate={handleAddCbmRate}
              handleRemoveCbmRate={handleRemoveCbmRate}
              handleCbmRateChange={handleCbmRateChange}
            />

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
  );
};

// Variations Section Component
const VariationsSection = ({ variations, handleAddVariation, handleRemoveVariation, handleVariationChange }) => {
  return (
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
      {variations.map((variation, index) => (
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
  );
};

// Fees Section Component
const FeesSection = ({ fees, handleAddFee, handleRemoveFee, handleFeeChange }) => {
  return (
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
      {fees.map((fee, index) => (
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
  );
};

// CBM Rates Section Component
const CBMRatesSection = ({ cbmRates, handleAddCbmRate, handleRemoveCbmRate, handleCbmRateChange }) => {
  return (
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
      {cbmRates.map((rate, index) => (
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
  );
};

export default ProductModal;