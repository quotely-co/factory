import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Phone, Mail, FileText, Truck, Calendar, Package, Clock,
  Image, ArrowLeft, ArrowRight, X, Download, Check, Upload
} from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("specifications");
  const [showMockup, setShowMockup] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 }); // In percentage
  const [logoSize, setLogoSize] = useState(20); // In percentage
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.quotely.shop/api/products/${productId}`);
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= product.moq) {
      setQuantity(value);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMockupToggle = () => {
    setShowMockup(!showMockup);
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {showMockup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">2D Product Mockup</h2>
              <button 
                onClick={handleMockupToggle}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: "500px" }}>
                {/* Product image as background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="max-h-full max-w-full flex items-center justify-center">
                      <Package size={120} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Logo overlay */}
                  {logoImage && (
                    <div 
                      className="absolute cursor-move"
                      style={{
                        left: `${logoPosition.x}%`,
                        top: `${logoPosition.y}%`,
                        width: `${logoSize}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      draggable={true}
                      onDragStart={(e) => {
                        // Store the starting position
                        e.dataTransfer.setData('text/plain', JSON.stringify(logoPosition));
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const rect = e.currentTarget.parentElement.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        setLogoPosition({ x, y });
                      }}
                    >
                      <img 
                        src={logoImage} 
                        alt="Your Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Upload Your Logo</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    >
                      <Upload size={16} className="mr-2" />
                      Select Logo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {logoImage && (
                      <button
                        onClick={() => setLogoImage(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Adjust Logo Size</h3>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={logoSize}
                    onChange={(e) => setLogoSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  onClick={handleMockupToggle}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Save Mockup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <span className="hover:text-black cursor-pointer">Home</span> &gt;{" "}
          <span className="hover:text-black cursor-pointer">Products</span> &gt;{" "}
          <span className="text-black font-medium">{product.name}</span>
        </div>

        {/* Product Overview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-2/5 border-r border-gray-200">
              <div className="h-80 bg-gray-50 flex items-center justify-center p-4 relative group">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Package size={96} className="text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={handleMockupToggle}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                  >
                    <Image size={16} className="mr-2" />
                    Try 2D Mockup
                  </button>
                </div>
              </div>
              <div className="flex justify-center p-4 border-t border-gray-200">
                <button
                  onClick={handleMockupToggle}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                >
                  <Image size={16} className="mr-2" />
                  Try 2D Mockup
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-3/5 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <span className="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                  In Stock
                </span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Truck size={18} className="text-gray-800 mr-2" />
                  <span className="text-gray-700">
                    Min. Order: <span className="font-medium">{product.moq} units</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-800 mr-2" />
                  <span className="text-gray-700">
                    Lead Time: <span className="font-medium">{product.leadTime || "2-3 weeks"}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-800 mr-2" />
                  <span className="text-gray-700">
                    Warranty: <span className="font-medium">{product.warranty || "12 months"}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Package size={18} className="text-gray-800 mr-2" />
                  <span className="text-gray-700">
                    Origin: <span className="font-medium">{product.origin || "India"}</span>
                  </span>
                </div>
              </div>

              {/* Price Information */}
              <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-gray-500 ml-2">/unit</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Bulk pricing available for orders above 1000 units
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium transition duration-200 flex-1">
                  Request Quote
                </button>
                <button className="border border-black text-black hover:bg-gray-100 py-3 px-6 rounded-md font-medium transition duration-200 flex-1">
                  Contact Supplier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "specifications" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "pricing" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("pricing")}
              >
                Pricing Details
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "shipping" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping Info
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "supplier" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("supplier")}
              >
                Supplier Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "specifications" && (
              <>
                <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{key}:</span>{" "}
                        <span className="font-medium">{value}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Material:</span>{" "}
                        <span className="font-medium">Premium Steel</span>
                      </div>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Dimensions:</span>{" "}
                        <span className="font-medium">15 x 10 x 5 cm</span>
                      </div>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Weight:</span>{" "}
                        <span className="font-medium">1.2 kg</span>
                      </div>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Color:</span>{" "}
                        <span className="font-medium">Silver, Black (customizable)</span>
                      </div>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Certification:</span>{" "}
                        <span className="font-medium">ISO 9001:2015</span>
                      </div>
                      <div className="border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Custom Packaging:</span>{" "}
                        <span className="font-medium">Available</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {activeTab === "pricing" && (
              <>
                <h2 className="text-xl font-bold mb-4">Pricing Details</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Volume Discounts</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-gray-600">1-999 units</div>
                      <div className="font-medium">₹{product.price} per unit</div>
                      <div className="text-gray-600">1,000-4,999 units</div>
                      <div className="font-medium">₹{Math.round(product.price * 0.95)} per unit (5% off)</div>
                      <div className="text-gray-600">5,000+ units</div>
                      <div className="font-medium">₹{Math.round(product.price * 0.9)} per unit (10% off)</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Payment Terms</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>50% advance payment</li>
                      <li>Balance before shipping</li>
                      <li>Net 30 payment terms available for regular customers</li>
                      <li>Multiple payment options including bank transfer, letter of credit</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeTab === "shipping" && (
              <>
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Shipping Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 border border-gray-200 rounded-md bg-white">
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-gray-600 text-sm">7-10 business days</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-md bg-white">
                        <div className="font-medium">Express Shipping</div>
                        <div className="text-gray-600 text-sm">3-5 business days</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-md bg-white">
                        <div className="font-medium">Air Freight</div>
                        <div className="text-gray-600 text-sm">5-7 business days</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded-md bg-white">
                        <div className="font-medium">Sea Freight</div>
                        <div className="text-gray-600 text-sm">20-30 business days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Shipping Policies</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Free shipping for orders above ₹50,000</li>
                      <li>All products are insured during transit</li>
                      <li>Customs duties and taxes may apply for international orders</li>
                      <li>Product packaging is optimized for safe transport</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeTab === "supplier" && (
              <>
                <h2 className="text-xl font-bold mb-4">Supplier Profile</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="rounded-full h-16 w-16 bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-700">
                            {product.supplier?.name?.charAt(0) || "Q"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{product.supplier?.name || "Quotely Supplier Co."}</h3>
                          <p className="text-gray-500 text-sm">{product.supplier?.location || "Mumbai, India"}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>Verified Supplier</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock size={16} className="mr-2" />
                          <span>Member since 2020</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="font-medium text-lg mb-3">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500 text-sm">Business Type</div>
                          <div className="font-medium">Manufacturer</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Year Established</div>
                          <div className="font-medium">2010</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Main Products</div>
                          <div className="font-medium">Industrial Equipment, Tools</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Quality Certifications</div>
                          <div className="font-medium">ISO 9001, CE</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-medium text-lg mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Phone size={16} className="text-gray-800 mr-3" />
                            <span>{product.supplier?.phone || "+91 98765 43210"}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail size={16} className="text-gray-800 mr-3" />
                            <span>{product.supplier?.email || "contact@quotelyshop.com"}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-800 mr-3" />
                            <span>GST: {product.supplier?.gst || "27AADCQ1234A1ZP"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quote Request Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Request a Custom Quote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Min. {product.moq})
                </label>
                <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              
              {product.variants && product.variants.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variant
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    value={selectedVariant?.id}
                    onChange={(e) => {
                      const selected = product.variants.find(v => v.id === e.target.value);
                      if (selected) handleVariantChange(selected);
                    }}
                  >
                    {product.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requirements
                </label>
                <textarea
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Describe any customizations or special requirements..."
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <button className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md font-medium transition duration-200">
                  Submit Quote Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1">Related Product {item}</h3>
                    <p className="text-gray-500 text-sm mb-2">Brief description of the product</p>
                    <div className="font-bold text-gray-900">₹{Math.round(product.price * (0.8 + (item * 0.1)))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Contact */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Contact Supplier</h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="sm:w-1/4">
                <div className="rounded-full w-20 h-20 bg-blue-100 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {product.supplier?.name?.charAt(0) || "Q"}
                  </span>
                </div>
                <h3 className="font-medium text-lg">{product.supplier?.name || "Quotely Supplier Co."}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.supplier?.location || "Mumbai, India"}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>Member since 2020</span>
                </div>
              </div>
              
              <div className="sm:w-3/4 space-y-4">
                <div className="flex items-center">
                  <Phone size={18} className="text-blue-500 mr-3" />
                  <span>{product.supplier?.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-blue-500 mr-3" />
                  <span>{product.supplier?.email || "contact@quotelyshop.com"}</span>
                </div>
                <div className="flex items-center">
                  <FileText size={18} className="text-blue-500 mr-3" />
                  <span>GST: {product.supplier?.gst || "27AADCQ1234A1ZP"}</span>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-200">
                    Contact Now
                  </button>
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-md font-medium transition duration-200">
                    View Company Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;