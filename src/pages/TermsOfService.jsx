export default function TermsOfService() {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Terms of Service</h2>
  
        <p className="text-gray-600 mb-4">
          Welcome to our White-Label Quotation Platform. By using our services, you agree to the following terms and conditions. Please read them carefully.
        </p>
  
        {/* 1. General Terms */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. General Terms</h3>
          <p className="text-gray-600">
            By accessing or using our platform, you acknowledge that you have read, understood, and agreed to these terms. We reserve the right to modify these terms at any time.
          </p>
        </section>
  
        {/* 2. User Responsibilities */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">2. User Responsibilities</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>You must provide accurate information while using our platform.</li>
            <li>Unauthorized use of our platform is strictly prohibited.</li>
            <li>We are not liable for any loss due to incorrect data input by the user.</li>
          </ul>
        </section>
  
        {/* 3. Payment & Subscription */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">3. Payments & Subscriptions</h3>
          <p className="text-gray-600">
            All transactions made through our platform are final. Subscription fees are charged based on the selected plan.
          </p>
        </section>
  
        {/* 4. Refund & Cancellation Policy */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">4. Refund & Cancellation Policy</h3>
          <p className="text-gray-600">
            We strive to ensure customer satisfaction. However, the following refund and cancellation policies apply:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Refunds:</strong> Refunds are only applicable if a technical issue prevents service usage and is not resolved within 7 business days.</li>
            <li><strong>Cancellations:</strong> You may cancel your subscription at any time, but no refunds will be issued for the current billing cycle.</li>
            <li><strong>Chargebacks:</strong> Unauthorized chargebacks will result in account suspension.</li>
          </ul>
        </section>
  
        {/* 5. Data Privacy */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">5. Data Privacy</h3>
          <p className="text-gray-600">
            Your data is securely stored and will not be shared with third parties, except as required by law. Read our <a href="/privacy-policy" className="text-blue-600">Privacy Policy</a> for more details.
          </p>
        </section>
  
        {/* 6. Limitation of Liability */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">6. Limitation of Liability</h3>
          <p className="text-gray-600">
            We are not responsible for any indirect damages or losses resulting from the use of our platform.
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
  