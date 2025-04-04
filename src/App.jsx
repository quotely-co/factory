import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/Loading";

// Lazy-loaded components
const Support = lazy(() => import("./pages/Support"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const FactoryDashboard = lazy(() => import("./pages/factory/FactoryDashboard"));

// Token handler component
const TokenHandler = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Save token in cookies
      Cookies.set("authToken", token, { expires: 7, path: "/" });

      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token]);

  return null; // No UI needed
};

const App = () => (
  <Router>
    <TokenHandler /> {/* Handles token extraction and storage */}
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/*" element={<FactoryDashboard />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
    </Suspense>
    <Toaster />
  </Router>
);

export default App;
