import React, { useState } from "react";
import { X, Image, PlusCircle, MinusCircle, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState({
    specifications: true,
    variations: true,
    fees: true,
    cbmRates: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

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

  const handleSpecificationChange = (field, value) => {
    setForm({
      ...form,
      specifications: {
        ...form.specifications,
        [field]: value
      }
    });
  };

  const handleColorOptionChange = (index, value) => {
    const newColorOptions = [...(form.specifications.colorOptions || [])];
    newColorOptions[index] = value;
    handleSpecificationChange('colorOptions', newColorOptions);
  };

  const addColorOption = () => {
    handleSpecificationChange('colorOptions', [...(form.specifications?.colorOptions || []), ""]);
  };

  const removeColorOption = (index) => {
    handleSpecificationChange(
      'colorOptions',
      (form.specifications?.colorOptions || []).filter((_, i) => i !== index)
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-md p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
            <h2 className="text-xl font-bold">
              {editingIndex !== null ? "Edit Product" : "Add New Product"}
            </h2>
            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:cursor-pointer hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Upload */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <div className="border-2 border-dashed rounded-lg p-4 h-48 flex items-center justify-center">
                  {form.image ? (
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Product preview"
                        className="h-36 w-36 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: "" })}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image size={28} className="text-gray-400 mx-auto mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-black font-medium hover:underline text-sm">Upload Image</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      {isUploading && (
                        <div className="mt-2 flex items-center justify-center space-x-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-500 border-t-transparent"></div>
                          <span className="text-xs text-gray-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
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
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">MOQ</label>
                  <div className="flex">
                    <input
                      type="number"
                      required
                      placeholder="Enter MOQ"
                      value={form.moq}
                      onChange={(e) => setForm({ ...form, moq: e.target.value })}
                      className="w-full p-2 rounded-l-lg border border-gray-200 text-sm"
                    />
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      className="border border-l-0 border-gray-200 rounded-r-lg px-3 text-sm bg-gray-50"
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
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
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
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    placeholder="Product description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* Product Specifications Section */}
            <CollapsibleSection 
              title="Product Specifications" 
              isExpanded={expandedSections.specifications}
              toggleExpanded={() => toggleSection('specifications')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Length (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Length"
                    value={form.specifications?.length || ""}
                    onChange={(e) => handleSpecificationChange('length', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Width (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Width"
                    value={form.specifications?.width || ""}
                    onChange={(e) => handleSpecificationChange('width', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Height"
                    value={form.specifications?.height || ""}
                    onChange={(e) => handleSpecificationChange('height', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity (ml)</label>
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={form.specifications?.capacity || ""}
                    onChange={(e) => handleSpecificationChange('capacity', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Kraft paper, PLA, etc."
                    value={form.specifications?.materialType || ""}
                    onChange={(e) => handleSpecificationChange('materialType', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GSM (g/m²)</label>
                  <input
                    type="number"
                    placeholder="Paper thickness"
                    value={form.specifications?.gsm || ""}
                    onChange={(e) => handleSpecificationChange('gsm', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Color Options</label>
                  <div className="space-y-2">
                    {(form.specifications?.colorOptions || []).map((color, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Color name or code"
                          value={color}
                          onChange={(e) => handleColorOptionChange(index, e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeColorOption(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addColorOption}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
                    >
                      <PlusCircle size={16} className="mr-1" />
                      Add Color Option
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Printing Technique</label>
                  <select
                    value={form.specifications?.printingTechnique || ""}
                    onChange={(e) => handleSpecificationChange('printingTechnique', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    <option value="">Select printing technique</option>
                    <option value="digital">Digital</option>
                    <option value="offset">Offset</option>
                    <option value="silkscreen">Silkscreen</option>
                    <option value="flexography">Flexography</option>
                    <option value="gravure">Gravure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Custom Finishes</label>
                  <select
                    value={form.specifications?.customFinish || ""}
                    onChange={(e) => handleSpecificationChange('customFinish', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    <option value="">Select finish type</option>
                    <option value="spotUV">Spot UV</option>
                    <option value="embossing">Embossing</option>
                    <option value="debossing">Debossing</option>
                    <option value="foilStamping">Foil Stamping</option>
                    <option value="lamination">Lamination</option>
                    <option value="varnish">Varnish</option>
                  </select>
                </div>
              </div>
            </CollapsibleSection>

            {/* Variations Section */}
            <CollapsibleSection 
              title="Size Variations" 
              isExpanded={expandedSections.variations}
              toggleExpanded={() => toggleSection('variations')}
              addButton={{
                label: "Add Variation",
                onClick: handleAddVariation
              }}
            >
              {form.variations.length > 0 ? (
                <div className="space-y-2">
                  {form.variations.map((variation, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Size"
                        value={variation.size}
                        onChange={(e) => handleVariationChange(index, 'size', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Base Price"
                        value={variation.basePrice}
                        onChange={(e) => handleVariationChange(index, 'basePrice', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No variations added yet.</p>
              )}
            </CollapsibleSection>

            {/* Fees Section */}
            <CollapsibleSection 
              title="Additional Fees" 
              isExpanded={expandedSections.fees}
              toggleExpanded={() => toggleSection('fees')}
              addButton={{
                label: "Add Fee",
                onClick: handleAddFee
              }}
            >
              {form.fees.length > 0 ? (
                <div className="space-y-2">
                  {form.fees.map((fee, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Fee Name"
                        value={fee.name}
                        onChange={(e) => handleFeeChange(index, 'name', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={fee.amount}
                        onChange={(e) => handleFeeChange(index, 'amount', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFee(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No fees added yet.</p>
              )}
            </CollapsibleSection>

            {/* CBM Rates Section */}
            <CollapsibleSection 
              title="CBM Rates" 
              isExpanded={expandedSections.cbmRates}
              toggleExpanded={() => toggleSection('cbmRates')}
              addButton={{
                label: "Add CBM Rate",
                onClick: handleAddCbmRate
              }}
            >
              {form.cbmRates.length > 0 ? (
                <div className="space-y-2">
                  {form.cbmRates.map((rate, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={rate.quantity}
                        onChange={(e) => handleCbmRateChange(index, 'quantity', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="CBM"
                        value={rate.cbm}
                        onChange={(e) => handleCbmRateChange(index, 'cbm', e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCbmRate(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No CBM rates added yet.</p>
              )}
            </CollapsibleSection>

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {editingIndex !== null ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Collapsible Section Component
const CollapsibleSection = ({ title, children, isExpanded, toggleExpanded, addButton }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className={`flex justify-between items-center p-3 cursor-pointer ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}
        onClick={toggleExpanded}
      >
        <h3 className="text-md font-medium">{title}</h3>
        <div className="flex gap-3 items-center">
          {addButton && isExpanded && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addButton.onClick();
              }}
              className="text-sm text-blue-600 flex items-center hover:text-blue-800"
            >
              <PlusCircle size={16} className="mr-1" />
              {addButton.label}
            </button>
          )}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t">{children}</div>
      )}
    </div>
  );
};

export default ProductModal;