import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import DashboardPanel from "../../components/Factory/DashboardPanel";
import Products from "../../components/Factory/Products";
import Quotations from "../../components/Factory/Quotations";
import Sidebar from "@/components/Factory/Sidebar";
import ProductDetail from "../../components/Factory/ProductDetail";

const FactoryDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-2 left-2 z-50 shadow-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-r">
          <div className="h-full overflow-y-auto">
            <Sidebar onSidebarClose={handleClose} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r shrink-0">
        <div className="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<DashboardPanel />} />
            <Route path="dashboard" element={<DashboardPanel />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="products" element={<Products />} />
            <Route path="analytics" element={<div>Analytics</div>} />
            <Route path="support" element={<div>Support</div>} />
            <Route path="product/:productId" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default FactoryDashboard;
