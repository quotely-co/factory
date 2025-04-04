import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FileTextIcon,
  TruckIcon,
  BarChart2,
  HelpCircleIcon,
  LogOut,
  Package,
  Bell,
  Settings,
} from "lucide-react";
import axios from "axios";

// Add onSidebarClose prop
const Sidebar = ({ onSidebarClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shop, setShop] = useState({});
  const { storeName } = useParams();
  const token = localStorage.getItem("token");
  const HOST = import.meta.env.VITE_HOST_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    if (onSidebarClose) onSidebarClose(); // Close sidebar on logout
    navigate("/login");
  };

  // Modified navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    if (onSidebarClose) onSidebarClose(); // Close sidebar after navigation
  };

  useEffect(() => {
    const fetchShop = async () => {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const factoryId = payload.factoryId;
      try {
        const response = await axios.get(`${HOST}/api/factory?id=${factoryId}`);
        setShop(response.data[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchShop();
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileTextIcon, label: "Quotations", path: "/quotations" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: HelpCircleIcon, label: "Support", path: "/support" },
  ];

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary p-2 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{shop.shopName}</span>
          <span className="text-xs text-muted-foreground">Factory Portal</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-6">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/api/placeholder/32/32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{shop.shopName}</span>
            <span className="text-xs text-muted-foreground">{shop.name}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          MAIN MENU
        </div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full hover:cursor-pointer justify-start hover:bg-secondary/60",
                isActive && "bg-secondary font-medium"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <Separator className="my-4" />

      {/* Quick Actions */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          QUICK ACTIONS
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => {
            // Handle notification click
            if (onSidebarClose) onSidebarClose();
          }}
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => {
            // Handle settings click
            if (onSidebarClose) onSidebarClose();
          }}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Logout */}
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        <Button 
          variant="destructive" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;