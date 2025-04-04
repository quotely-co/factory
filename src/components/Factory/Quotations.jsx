import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuotationBuilder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [factory, setFactory] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const HOST = import.meta.env.VITE_HOST_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    const factoryId = payload.factoryId;

    const fetchProduct = async () => {
      const res = await axios.get(`${HOST}/api/products?id=${factoryId}`);
      setProducts(res.data);
    };
    const fetchFactory = async () => {

      const response = await axios.get(`${HOST}/api/factory?id=${factoryId}`);
      setFactory(response.data[0]);
    };
    fetchProduct();
    fetchFactory();
  }, []);

  const [quotationDetails, setQuotationDetails] = useState({
    clientName: '',
    clientLogo: null,
    salesRep: '',
    notes: ''
  });

  const calculateProductTotal = (product) => {
    const baseAmount = product.quantity * product.selectedVariation.basePrice;
    const fees = product.fees.reduce((sum, fee) => sum + fee.amount, 0);
    return baseAmount + fees;
  };

  const removeProductFromQuotation = (idx) => {
    const updatedProducts = selectedProducts.filter((_, index) => index !== idx);
    setSelectedProducts(updatedProducts);
  };

  const calculateDiscount = (total) => {
    if (total > 10000) return 0.15;
    if (total > 5000) return 0.10;
    if (total > 2000) return 0.05;
    return 0;
  };

  const addProductToQuotation = (product, variation) => {
    setSelectedProducts([...selectedProducts, {
      ...product,
      selectedVariation: variation,
      quantity: product.moq
    }]);
  };
  const DownloadPDF = async () => {
    try {

      const response = await axios.post(
        `${HOST}/api/factory/generate-pdf`,
        {

          factoryName: "My Factory",
          data: selectedProducts, // Send as an object instead of JSON string
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "quotation.pdf"); // Set file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const calculateTotalAmount = () => {
    const total = selectedProducts.reduce((sum, product) => sum + calculateProductTotal(product), 0);
    const discount = calculateDiscount(total);
    const discountAmount = total * discount;
    const finalAmount = total - discountAmount;
    return {
      total,
      discountAmount,
      finalAmount
    };
  };

  const { total, discountAmount, finalAmount } = calculateTotalAmount();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Quotation Builder</h1>
          <button
            onClick={DownloadPDF}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 sm:mt-0"
          >
            Download Quotation
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Product Selection Panel */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-gray-700">Available Products</h2>
            <div className="space-y-6">
              {products.map(product => (
                <div key={product._id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex flex-col items-start sm:flex-row sm:items-center sm:space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="mt-4 flex-1 sm:mt-0">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {isExpanded
                          ? product.description
                          : `${product.description.slice(0, 100)}...`}
                      </p>
                      <button
                        className="text-blue-500 text-xs mt-2"
                        onClick={toggleDescription}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                      <p className="mt-2 text-sm font-medium text-gray-700">MOQ: {product.moq} units</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {product.variations.map((variation, idx) => (
                          <button
                            key={idx}
                            onClick={() => addProductToQuotation(product, variation)}
                            className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200"
                          >
                            Add {variation.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quotation Preview Panel */}
          <div id="quotation-content" className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <img
                src={factory.logo_url}
                alt="Factory logo"
                className="h-12 w-auto"
              />
              <div className="text-right">
                <p className="font-semibold text-gray-800">{factory.name || "nme"}</p>
                <p className="text-sm text-gray-500">
                  Valid until: {new Date(Date.now() * 86400000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Client Name"
              className="mb-6 w-full rounded-lg border border-gray-300 p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
              value={quotationDetails.clientName}
              onChange={(e) => setQuotationDetails({ ...quotationDetails, clientName: e.target.value })}
            />

            {selectedProducts.length > 0 ? (
              <div className="space-y-4">
                {selectedProducts.map((product, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {product.name} - {product.selectedVariation.size}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${product.selectedVariation.basePrice} per unit
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-gray-200"
                          onClick={() => {
                            const newProducts = [...selectedProducts];
                            newProducts[idx].quantity = Math.max(product.moq, product.quantity - product.increment);
                            setSelectedProducts(newProducts);
                          }}
                        >
                          -
                        </button>
                        <span className="font-medium text-gray-800">{product.quantity}</span>
                        <button
                          className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-gray-200"
                          onClick={() => {
                            const newProducts = [...selectedProducts];
                            newProducts[idx].quantity += product.increment;
                            setSelectedProducts(newProducts);
                          }}
                        >
                          +
                        </button>
                        <button
                          className="rounded-lg bg-red-100 px-2 py-1 text-red-700 hover:bg-red-200"
                          onClick={() => removeProductFromQuotation(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">No products added to the quotation yet.</div>
            )}

            <textarea
              placeholder="Additional Notes"
              className="mt-6 w-full rounded-lg border border-gray-300 p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
              value={quotationDetails.notes}
              onChange={(e) => setQuotationDetails({ ...quotationDetails, notes: e.target.value })}
            />

            {/* Summary Panel */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="text-gray-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Discount:</span>
                <span className="text-gray-800">-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Final Amount:</span>
                <span className="text-gray-800">${finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default QuotationBuilder;
