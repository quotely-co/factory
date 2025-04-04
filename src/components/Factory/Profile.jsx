import React, { useState } from 'react';
import { Edit, Plus, Minus } from 'lucide-react';

const Profile = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Sample Factory',
    logo: '/api/placeholder/200/100',
    description: 'Leading manufacturer of custom packaging solutions',
    contact: {
      email: 'contact@factory.com',
      phone: '+1234567890',
      address: '123 Industrial Ave, Business District',
    },
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Paper Cup',
      variations: ['6oz', '8oz', '12oz'],
      basePrice: 0.05,
      moq: 1000,
      image: '/api/placeholder/300/300',
      description: 'High-quality disposable paper cups',
    },
    {
      id: 2,
      name: 'Food Container',
      variations: ['Small', 'Medium', 'Large'],
      basePrice: 0.08,
      moq: 500,
      image: '/api/placeholder/300/300',
      description: 'Durable food packaging containers',
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className=" mx-auto p-4">
      {/* Company Profile Section */}
      <div className=" mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="logo-ticker-image mb-4"
            />
            <h1 className="section-title">{companyInfo.name}</h1>
            <p className="section-description mt-2">{companyInfo.description}</p>
          </div>
          <button className="btn btn-text">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <h3 className="font-bold mb-2">Contact</h3>
            <p className="text-[#010d3e]">{companyInfo.contact.email}</p>
            <p className="text-[#010d3e]">{companyInfo.contact.phone}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Location</h3>
            <p className="text-[#010d3e]">{companyInfo.contact.address}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Quick Links</h3>
            <button className="btn btn-text">Request Catalog</button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <h2 className="section-title mb-6">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-[#010d3e] mb-4">{product.description}</p>

            <div className="space-y-2">
              <p className="tag">Starting from ${product.basePrice}</p>
              <p className="tag">MOQ: {product.moq} units</p>
            </div>

            <div className="mt-4">
              <h4 className="font-bold mb-2">Available Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((size) => (
                  <span key={size} className="tag">
                    {size}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary w-full mt-6"
              onClick={() => setSelectedProduct(product)}
            >
              Request Quote
            </button>
          </div>
        ))}
      </div>

      {/* Quick Contact Section */}
      <div className=" mt-8">
        <h2 className="section-title mb-6">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[#010d3e] mb-4">
              Need custom solutions or have questions about our products? Our
              team is here to help you find the perfect packaging solutions for
              your business.
            </p>
            <button className="btn btn-primary">Contact Sales Team</button>
          </div>
          <div className="text-[#010d3e]">
            <p className="mb-2">✓ Custom design services available</p>
            <p className="mb-2">✓ Bulk order discounts</p>
            <p className="mb-2">✓ Quick turnaround times</p>
            <p>✓ Global shipping capability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
