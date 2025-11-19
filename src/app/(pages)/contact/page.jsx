"use client";
import StationHeader from "@/components/stationheader";
import React, { useState } from "react";

function FormJsx() {
  const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("✅ Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setErrorMessage("❌ Failed to send message.");
      }
    } catch {
      setErrorMessage("⚠️ An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StationHeader title="Contact" />

      {/* ✅ أضفت padding جانبي للشاشات الصغيرة */}
      <section className="bg-hexagons flex justify-center items-center py-12 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Get in Touch
          </h2>
          <p className="mb-8 text-gray-600 text-sm sm:text-base">
            Balance Desalination Technologies – Innovating water treatment and
            desalination through advanced simulation and training tools.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                required
                className="w-full p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+123 456 7890"
                required
                className="w-full p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block mb-1 text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
                className="w-full p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 bg-gray-50"
              />
            </div>

            {/* Message */}
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
                className="w-full p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 resize-none bg-gray-50"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-medium bg-[#184b72] hover:bg-[#193850] transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          {/* إشعارات */}
          {successMessage && (
            <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default FormJsx;
