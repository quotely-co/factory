export default function RefundPolicy() {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Cancellation & Refund Policy</h2>
  
        <p className="text-gray-600 mb-4">
          We aim to provide a smooth experience. This policy outlines our rules for cancellations and refunds.
        </p>
  
        {/* 1. Cancellation Policy */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. Cancellation Policy</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Subscriptions can be canceled at any time from your account settings.</li>
            <li>Cancellation will stop future payments but does not provide refunds for the current billing period.</li>
          </ul>
        </section>
  
        {/* 2. Refund Policy */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">2. Refund Policy</h3>
          <p className="text-gray-600">We offer refunds under the following conditions:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>Technical Issues:</strong> If a major system error prevents service usage, and we fail to resolve it within 7 business days.</li>
            <li><strong>Unauthorized Charges:</strong> If a payment was made without authorization and reported within 14 days.</li>
            <li><strong>Non-Refundable Services:</strong> Custom services, one-time fees, and setup charges are non-refundable.</li>
          </ul>
        </section>
  
        {/* 3. How to Request a Refund */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">3. How to Request a Refund</h3>
          <p className="text-gray-600">
            To request a refund, email us at <strong>support@whitelabel.com</strong> with your order ID and reason. Refunds are processed within 7-10 business days.
          </p>
        </section>
  
        {/* 4. Dispute Resolution */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">4. Dispute Resolution</h3>
          <p className="text-gray-600">
            If you are unsatisfied with the resolution, disputes can be escalated to the appropriate consumer protection authority in India.
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
  