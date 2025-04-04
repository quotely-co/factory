import { useState } from "react";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your support request has been submitted!");
    setFormData({ name: "", email: "", issue: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Support Center</h2>
      
      <p className="text-gray-600 text-center mb-6">
        Need help? Browse FAQs or submit a support request.
      </p>

      {/* FAQs Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="border p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">How do I generate a quotation?</summary>
            <p className="mt-2 text-gray-600">Go to your dashboard, select a product, enter details, and click ‘Generate Quotation’.</p>
          </details>
          <details className="border p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">Can I customize my quotation PDF?</summary>
            <p className="mt-2 text-gray-600">Yes! You can add your logo, colors, and signatures to match your brand.</p>
          </details>
          <details className="border p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">What payment options do you support?</summary>
            <p className="mt-2 text-gray-600">We support Stripe, Razorpay, and PayPal for seamless transactions.</p>
          </details>
        </div>
      </div>

      {/* Support Form */}
      <h3 className="text-xl font-semibold mb-4">Submit a Support Request</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <textarea
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          placeholder="Describe your issue..."
          className="w-full p-3 border rounded-lg"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>

      {/* Contact Details */}
      <div className="mt-6 text-center">
      <p className="text-gray-700">
          📍 Address: Chemmankadavu , Malappuram, kerala, India
        </p>
        <p className="text-gray-700">📞 Support Phone: +91 9744676504</p>
        <p className="text-gray-700">✉ Email: qquotely7@gmail.com</p>
        <p className="text-gray-700">🕒 Support Hours: Mon-Fri, 9AM - 6PM IST</p>
      </div>
    </div>
  );
}
