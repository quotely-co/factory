import React from "react";
import { 
  FileText, 
  Package, 
  Clock, 
  DollarSign
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPanel = () => {
  // Sample data for charts
  const quotationData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 65 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 72 }
  ];

  const stats = [
    { 
      title: "Total Quotations", 
      value: 120, 
      change: "+12% this month",
      icon: <FileText size={20} className="text-blue-500" />
    },
    { 
      title: "Active Products", 
      value: 45, 
      change: "5 added this week",
      icon: <Package size={20} className="text-green-500" />
    },
    { 
      title: "Pending Quotes", 
      value: 8, 
      change: "3 need attention",
      icon: <Clock size={20} className="text-orange-500" />
    },
    { 
      title: "Monthly Revenue", 
      value: "₹4,50,000", 
      change: "+18% vs last month",
      icon: <DollarSign size={20} className="text-purple-500" />
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factory Dashboard</h1>
          <p className="text-gray-600">Welcome back, manage your quotations and track performance</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
          <FileText size={18} className="mr-2" />
          New Quotation
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                {stat.icon}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-auto">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quotation Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;