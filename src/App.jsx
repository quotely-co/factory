import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/Loading";
import InvalidSubdomainError from "./pages/InvalidSubdomainError";
import useSubdomainValidation from "./hooks/useSubdomainValidation";

const FactoryDashboard = lazy(() => import("./pages/factory/FactoryDashboard"));
const Support = lazy(() => import("./pages/Support"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

function AppRouter() {
  const { isValidSubdomain, subdomain } = useSubdomainValidation();
  // if jwt if url then srtore and remove that from the url
  const token = new URLSearchParams(window.location.search).get("token");
  if (token) {
    localStorage.setItem('token' , token)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  if (isValidSubdomain === null) {
    return <LoadingSpinner />;
  }

  if (subdomain && isValidSubdomain === false) {
    return <InvalidSubdomainError />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {isValidSubdomain && subdomain ? (
            <Route path="/*" element={<FactoryDashboard subdomain={subdomain} />} />
          ) : (
            <>
              <Route path="/" element={<Support />} />
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
