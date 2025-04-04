import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>
      
      <p className="text-gray-600 text-center mb-6">
        Have questions? We're here to help. Reach out to us anytime.
      </p>

      {/* Contact Form */}
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
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>

      {/* Contact Details */}
      <div className="mt-6 text-center">
        
        <p className="text-gray-700">📞 Phone: +91 9744676504</p>
        <p className="text-gray-700">✉ Email: quotely7@gmail.com</p>
      </div>

      {/* Google Maps (Optional) */}
      <div className="mt-6">
        <iframe
          title="Google Maps"
          className="w-full h-64 rounded-lg border"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509667!2d144.9559263159045!3d-37.8172099797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727f87d5e7e08d!2sBusiness%20Hub!5e0!3m2!1sen!2sin!4v1649763896345!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
