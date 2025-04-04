import React from 'react';
import { Card } from "@/components/ui/card";
import { Package, FileText, ArrowRight } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <Card className="p-8 space-y-6 max-w-md w-full mx-4">
        <div className="flex justify-center">
          <div className="relative">
            {/* Animated icons */}
            <div className="flex items-center gap-4 animate-pulse">
              <Package className="h-8 w-8 text-blue-600" />
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <FileText className="h-8 w-8 text-blue-600" />
            </div>

            {/* Loading bar */}
            <div className="mt-6 h-1.5 w-48 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-loadingBar"></div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Preparing Your Quotation Portal
          </h3>
          <p className="text-sm text-muted-foreground">
            Loading business resources...
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoadingSpinner;