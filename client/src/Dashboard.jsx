
// ================= DASHBOARD =================
// client/src/Dashboard.js
import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Dashboard({ token }) {

const API = import.meta.env.VITE_API_URL;  
  const [form, setForm] = useState({ projectType: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await axios.post(
      `${API}/api/orders`,
      form,
      { headers: { Authorization: token } }
    );
    alert("Order submitted");
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">Create Project Order</h2>

          <p className="text-gray-600 mb-4">
            We serve 20+ project categories and build your projects at an affordable price.
          </p>

          <div className="space-y-4">
            <select className="w-full p-3 border rounded" name="projectType" onChange={handleChange}>
              <option value="">Select Project</option>
              <option value="IoT">IoT</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="AI">AI</option>
              <option value="AI + IoT">AI + IoT</option>
            </select>

            <textarea
              className="w-full p-3 border rounded"
              name="description"
              placeholder="Describe your project"
              onChange={handleChange}
            />

            <button
              className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
              onClick={submit}
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
            <Footer />

    </div>
    
  );
  
}

