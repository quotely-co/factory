import React from "react";
import { Trash2, Edit2, Image } from "lucide-react";

const ProductTable = ({ products, handleEdit, handleDelete }) => {
  return (
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
          {products.map((product) => (
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
  );
};

export default ProductTable;