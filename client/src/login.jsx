import React, { useState } from "react";
import axios from "axios";

export default function Login({ setToken }) {

  // ✅ ADD THIS (your live backend)
 const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,   // ✅ UPDATED
        {
          email: form.email,
          password: form.password
        }
      );

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data || "Login failed");
    }
  };

  const register = async () => {
    try {
      console.log("FORM DATA:", form);

      await axios.post(
        `${API}/api/auth/register`,   // ✅ UPDATED
        form
      );

      alert("Registered! Now login");

    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data || "Register failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>

        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />

          <input
            className="w-full p-3 border rounded"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="w-full p-3 border rounded"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <input
            className="w-full p-3 border rounded"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            onClick={login}
          >
            Login
          </button>

          <button
            className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-black"
            onClick={register}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}