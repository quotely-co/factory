import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/Loading";

const Landing = lazy(() => import("./pages/Landing"));
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
    if (subdomain) {
      fetch(`/api/check-subdomain?subdomain=${subdomain}`)
        .then((res) => res.json())
        .then((data) => {
          setIsValidSubdomain(data.valid); // Backend should return { valid: true/false }
        })
        .catch(() => setIsValidSubdomain(false)); // If error, assume invalid
    } else {
      setIsValidSubdomain(true); // No subdomain, so allow access
    }
  }, [subdomain]);

  if (isValidSubdomain === null) {
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
              <Route path="/" element={<Landing />} />
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
