// components/Factory/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://api.quotely.shop/api/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-muted-foreground">{product.description}</p>
      <div className="border p-4 rounded-md">
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>MOQ:</strong> {product.moq}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default ProductDetail;
