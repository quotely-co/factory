export default function PrivacyPolicy() {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h2>
  
        <p className="text-gray-600 mb-4">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal data when you use our White-Label Quotation Platform.
        </p>
  
        {/* 1. Information We Collect */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. Information We Collect</h3>
          <p className="text-gray-600">We collect the following types of information:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Personal Information: Name, email, phone number, and business details.</li>
            <li>Payment Data: Billing details for transactions.</li>
            <li>Technical Data: IP address, browser type, and device information.</li>
          </ul>
        </section>
  
        {/* 2. How We Use Your Information */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">2. How We Use Your Information</h3>
          <p className="text-gray-600">We use your data to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide services and process transactions.</li>
            <li>Improve our platform and customer experience.</li>
            <li>Send notifications, updates, and promotional content.</li>
          </ul>
        </section>
  
        {/* 3. Data Sharing & Disclosure */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">3. Data Sharing & Disclosure</h3>
          <p className="text-gray-600">
            We do not sell your data. However, we may share it with third parties for payment processing, legal compliance, and service enhancement.
          </p>
        </section>
  
        {/* 4. Security Measures */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">4. Security Measures</h3>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your data. However, no online transmission is 100% secure.
          </p>
        </section>
  
        {/* 5. User Rights */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">5. Your Rights</h3>
          <p className="text-gray-600">
            You can access, update, or delete your data by contacting us at support@whitelabel.com.
          </p>
        </section>
  
        {/* 6. Changes to Policy */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">6. Changes to This Policy</h3>
          <p className="text-gray-600">
            We may update this Privacy Policy. Continued use of our platform constitutes acceptance of the changes.
          </p>
        </section>
  
        {/* Contact Information */}
        <section className="mt-6 text-center">
          <p className="text-gray-700">📞 Support Phone: +91 98765 43210</p>
          <p className="text-gray-700">✉ Email: support@whitelabel.com</p>
        </section>
      </div>
    );
  }
  