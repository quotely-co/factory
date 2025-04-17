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
  ShoppingCart,
  Send,
  ClipboardList,
  User,
  Home
} from "lucide-react";
import axios from "axios";

// Add onSidebarClose prop
const Sidebar = ({ onSidebarClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shop, setShop] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  // take name from subdomain
  const hostParts = window.location.hostname.split(".");
  const isLocalhost = window.location.hostname === "localhost";
  const hasSubdomain = hostParts.length > 2 || (!isLocalhost && hostParts.length > 1);
  const subdomain = hasSubdomain ? hostParts[0] : null;

 

  const token = localStorage.getItem("token");
  const HOST = import.meta.env.VITE_HOST_URL;

  // Check if token exists on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      setIsAdmin(true);
    }else{
      setIsAdmin(false);
    }
    if (token) {
      fetchShop(token);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      localStorage.removeItem("token"); // Remove token from localStorage
      setIsAdmin(false); // Update state
      window.location.href = "https://quotely.shop/factory/login?logout=true"; // Redirect after logout
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  // Modified navigation handler
  const handleNavigation = (path) => {
    navigate(path);
    if (onSidebarClose) onSidebarClose(); // Close sidebar after navigation
  };

  const fetchShop = async (token) => {
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

  // Factory Admin menu items
  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileTextIcon, label: "Quotations", path: "/quotations" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: HelpCircleIcon, label: "Support", path: "/support" },
  ];

  // Regular User menu items (focused on requesting quotes)
  const userMenuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Send, label: "Request Quote", path: "/request-quote" },
    { icon: ClipboardList, label: "My Quotations", path: "/my-quotations" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // Select which menu items to show based on role
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary p-2 rounded-lg">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">{subdomain}</span>
          <span className="text-xs text-muted-foreground">
            {isAdmin ? "Factory Portal" : "Quotation Platform"}
          </span>
        </div>
      </div>

      {/* User Profile - Show only for admins */}
      {isAdmin && (
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/32/32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{subdomain}</span>
              <span className="text-xs text-muted-foreground">{subdomain}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
          {isAdmin ? "FACTORY MANAGEMENT" : "QUOTATION CENTER"}
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

      {/* Quick Actions - Different for both roles */}
      {isAdmin ? (
        <>
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
        </>
      ) : (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
            ACCOUNT
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("/quote-history")}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            Quote History
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("/support")}
          >
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
        </div>
      )}

      {/* Logout or Login based on role */}
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        {isAdmin ? (
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-full justify-start"
            onClick={() => window.location.href = "https://quotely.shop/factory/login"}
          >
            <LogOut className="mr-2 h-4 w-4" /> Login as Factory
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;