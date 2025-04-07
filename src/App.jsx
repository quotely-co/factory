import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/Loading";
import axios from "axios";

const FactoryDashboard = lazy(() => import("./pages/factory/FactoryDashboard"));
const Support = lazy(() => import("./pages/Support"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

function AppRouter() {
  const [isValidSubdomain, setIsValidSubdomain] = useState(null);
  const hostParts = window.location.hostname.split(".");
  const isLocalhost = window.location.hostname === "localhost";
  const hasSubdomain = hostParts.length > 2 || (!isLocalhost && hostParts.length > 1);
  const subdomain = hasSubdomain ? hostParts[0] : null;

  useEffect(() => {
    const checkSubdomain = async () => {
      if (subdomain) {
        try {
          const { data } = await axios.get(`https://api.quotely.shop/api/check-subdomain?subdomain=${subdomain}`);
       
          setIsValidSubdomain(data?.valid); // Assuming API response structure like { valid: true }
        } catch (error) {
          console.error("Error checking subdomain:", error);
          setIsValidSubdomain(false);
        }
      } else {
        alert("No")
        setIsValidSubdomain(true); // No subdomain, so allow access to public pages
      }
    };

    checkSubdomain();
  }, [subdomain]);

  if (isValidSubdomain === null) {
    // window.location.href = "https://quotely.shop"; // Redirect to main site if no subdomain
    return <LoadingSpinner />; // Show loading while checking
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {isValidSubdomain && subdomain ? (
            <Route path="/*" element={<FactoryDashboard subdomain={subdomain} />} />
          ) : (
            <>
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
            </>
          )}
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default AppRouter;
