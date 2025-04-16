import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  Phone, Mail, FileText, Truck, Calendar, Package, Clock,
  Image, ArrowLeft, ArrowRight, X, Download, Check, Upload,
  Heart, Share2, ShoppingCart
} from "lucide-react";
import ProductMockup3D from './ProductMockup3D';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("specifications");
  const [showMockup, setShowMockup] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
        <ProductMockup3D
          isOpen={showMockup}
          product={product}
          onClose={handleMockupToggle}
          onSave={(logoImage, logoSize) => {
            console.log("Mockup saved with logo:", logoImage, "size:", logoSize);
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span> &gt;{" "}
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Products</span> &gt;{" "}
          <span className="text-blue-600 font-medium">{product.name}</span>
        </div>

        {/* Product Overview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-2/5 border-r border-gray-100">
              <div className="h-96 bg-gray-50 flex items-center justify-center p-4 relative group">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Package size={96} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={handleMockupToggle}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transform transition-transform duration-300 hover:scale-105 shadow-lg"
                  >
                    <Image size={18} />
                    Try 3D Mockup
                  </button>
                </div>
              </div>
              <div className="flex justify-center p-4 border-t border-gray-100">
                <button
                  onClick={handleMockupToggle}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transform transition-transform duration-300 hover:scale-105 shadow-md"
                >
                  <Image size={18} />
                  Try 3D Mockup
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-3/5 p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                  In Stock
                </span>
              </div>

              <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <Truck size={20} className="text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    Min. Order: <span className="font-medium">{product.moq} units</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="text-blue-600 mr-3" />
                  <span className="text-gray-700">
                    Lead Time: <span className="font-medium">{product.leadTime || "2-3 weeks"}</span>
                  </span>
                </div>
              </div>

              {/* Price Information */}
              <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">₹{product.variations ? product.variations[0].basePrice : product.price}</span>
                  <span className="text-gray-500 ml-2">/unit</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Bulk pricing available for orders above 1000 units
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex-1 flex items-center justify-center gap-2 shadow-md">
                  <ShoppingCart size={18} />
                  Request Quote
                </button>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex-1 flex items-center justify-center gap-2">
                  <Phone size={18} />
                  Contact Supplier
                </button>
                <button 
                  onClick={toggleWishlist}
                  className={`p-3 rounded-lg border transition-all duration-300 ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button className="p-3 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 transition-all duration-300">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              {["specifications", "pricing", "shipping", "supplier"].map((tab) => (
                <button 
                  key={tab}
                  className={`px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === tab 
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "specifications" && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">{key}:</span>{" "}
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Material:</span>{" "}
                        <span className="font-medium text-gray-900">Premium Steel</span>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Dimensions:</span>{" "}
                        <span className="font-medium text-gray-900">15 x 10 x 5 cm</span>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Weight:</span>{" "}
                        <span className="font-medium text-gray-900">1.2 kg</span>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Color:</span>{" "}
                        <span className="font-medium text-gray-900">Silver, Black (customizable)</span>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Certification:</span>{" "}
                        <span className="font-medium text-gray-900">ISO 9001:2015</span>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <span className="text-gray-500">Custom Packaging:</span>{" "}
                        <span className="font-medium text-gray-900">Available</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Pricing Details</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-medium text-lg mb-4 text-gray-900">Volume Discounts</h3>
                    <div className="grid grid-cols-3 gap-y-4">
                      <div className="text-gray-600">1-999 units</div>
                      <div className="font-medium text-gray-900">₹{product.price} per unit</div>
                      <div className="text-blue-600 font-medium">Standard Price</div>
                      
                      <div className="text-gray-600">1,000-4,999 units</div>
                      <div className="font-medium text-gray-900">₹{Math.round(product.price * 0.95)} per unit</div>
                      <div className="text-green-600 font-medium">5% off</div>
                      
                      <div className="text-gray-600">5,000+ units</div>
                      <div className="font-medium text-gray-900">₹{Math.round(product.price * 0.9)} per unit</div>
                      <div className="text-green-600 font-medium">10% off</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-medium text-lg mb-4 text-gray-900">Payment Terms</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        50% advance payment
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Balance before shipping
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Net 30 payment terms available for regular customers
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Multiple payment options including bank transfer, letter of credit
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Shipping Information</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-medium text-lg mb-4 text-gray-900">Shipping Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="font-medium text-gray-900">Standard Shipping</div>
                        <div className="text-gray-600 text-sm">7-10 business days</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="font-medium text-gray-900">Express Shipping</div>
                        <div className="text-gray-600 text-sm">3-5 business days</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="font-medium text-gray-900">Air Freight</div>
                        <div className="text-gray-600 text-sm">5-7 business days</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="font-medium text-gray-900">Sea Freight</div>
                        <div className="text-gray-600 text-sm">20-30 business days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-medium text-lg mb-4 text-gray-900">Shipping Policies</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Free shipping for orders above ₹50,000
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        All products are insured during transit
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Customs duties and taxes may apply for international orders
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-600" />
                        Product packaging is optimized for safe transport
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "supplier" && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Supplier Profile</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="rounded-full h-16 w-16 bg-blue-100 flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-700">
                            {product.supplier?.name?.charAt(0) || "Q"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg text-gray-900">{product.supplier?.name || "Quotely Supplier Co."}</h3>
                          <p className="text-gray-500 text-sm">{product.supplier?.location || "Mumbai, India"}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700">
                          <Check size={16} className="text-green-600 mr-2" />
                          <span>Verified Supplier</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock size={16} className="text-blue-600 mr-2" />
                          <span>Member since 2020</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-medium text-lg mb-4 text-gray-900">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-gray-500 text-sm">Business Type</div>
                          <div className="font-medium text-gray-900">Manufacturer</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Year Established</div>
                          <div className="font-medium text-gray-900">2010</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Main Products</div>
                          <div className="font-medium text-gray-900">Industrial Equipment, Tools</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Quality Certifications</div>
                          <div className="font-medium text-gray-900">ISO 9001, CE</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium text-lg mb-4 text-gray-900">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Phone size={18} className="text-blue-600 mr-3" />
                            <span>{product.supplier?.phone || "+91 98765 43210"}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail size={18} className="text-blue-600 mr-3" />
                            <span>{product.supplier?.email || "contact@quotelyshop.com"}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText size={18} className="text-blue-600 mr-3" />
                            <span>GST: {product.supplier?.gst || "27AADCQ1234A1ZP"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quote Request Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Request a Custom Quote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Min. {product.moq})
                </label>
                <input
                  type="number"
                  min={product.moq}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {product.variants && product.variants.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant
                  </label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any customizations or special requirements..."
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                  <ShoppingCart size={18} />
                  Submit Quote Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group">
                  <div className="h-52 bg-gray-50 flex items-center justify-center relative">
                    <Package size={48} className="text-gray-300" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">Related Product {item}</h3>
                    <p className="text-gray-500 text-sm mb-2">Brief description of the product</p>
                    <div className="font-bold text-gray-900">₹{Math.round(product.price * (0.8 + (item * 0.1)))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Contact */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Supplier</h2>
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <div className="sm:w-1/4">
                <div className="rounded-full w-20 h-20 bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-700">
                    {product.supplier?.name?.charAt(0) || "Q"}
                  </span>
                </div>
                <h3 className="font-medium text-xl text-gray-900">{product.supplier?.name || "Quotely Supplier Co."}</h3>
                <p className="text-gray-500 text-sm mb-3">{product.supplier?.location || "Mumbai, India"}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={14} className="mr-2" />
                  <span>Member since 2020</span>
                </div>
              </div>
              
              <div className="sm:w-3/4 space-y-4">
                <div className="flex items-center">
                  <Phone size={20} className="text-blue-600 mr-4" />
                  <span className="text-gray-700">{product.supplier?.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={20} className="text-blue-600 mr-4" />
                  <span className="text-gray-700">{product.supplier?.email || "contact@quotelyshop.com"}</span>
                </div>
                <div className="flex items-center">
                  <FileText size={20} className="text-blue-600 mr-4" />
                  <span className="text-gray-700">GST: {product.supplier?.gst || "27AADCQ1234A1ZP"}</span>
                </div>
                
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
                    <Phone size={18} />
                    Contact Now
                  </button>
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                    <FileText size={18} />
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