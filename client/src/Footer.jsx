import React from "react";

export default function Footer() {
  return (
    <div className="w-full bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-indigo-400">
              ProjectHub
            </h2>
            <p className="text-gray-400 max-w-sm">
              We deliver projects in affordable and valuable pricing with high quality solutions for students and developers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>IoT Projects</li>
              <li>AI Models</li>
              <li>Software Development</li>
              <li>Hardware Projects</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-3">Highlights</h3>
            <ul className="space-y-2 text-gray-400">
              <li>20+ Project Categories</li>
              <li>Affordable Pricing</li>
              <li>Fast Delivery</li>
              <li>Student Friendly</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          © 2026 ProjectHub. All rights reserved.
        </div>

      </div>
    </div>
  );
}