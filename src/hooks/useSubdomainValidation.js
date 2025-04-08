import { useEffect, useState } from "react";
import axios from "axios";

const useSubdomainValidation = () => {
  const [isValidSubdomain, setIsValidSubdomain] = useState(null);
  const hostParts = window.location.hostname.split(".");
  const isLocalhost = window.location.hostname === "localhost";
  const hasSubdomain = hostParts.length > 2 || (!isLocalhost && hostParts.length > 1);
  const subdomain = hasSubdomain ? hostParts[0] : null;

  useEffect(() => {
    if (isValidSubdomain && subdomain) {
      document.title = `${subdomain} - Dashboard`;
    }
  }, [isValidSubdomain, subdomain]);

  useEffect(() => {
    const checkSubdomain = async () => {
      if (subdomain) {
        try {
          const { data } = await axios.get(`https://api.quotely.shop/api/check-subdomain?subdomain=${subdomain}`);
          setIsValidSubdomain(data?.valid);
        } catch (error) {
          console.error("Error checking subdomain:", error);
          setIsValidSubdomain(false);
        }
      } else {
        setIsValidSubdomain(true);
      }
    };

    checkSubdomain();
  }, [subdomain]);

  return { isValidSubdomain, subdomain };
};

export default useSubdomainValidation;
