"use client"; // Required for tabs to work
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// 1. Import the centralized data from your data.js file
import { PRODUCTS_DATA } from "../data"; 

export default function ProductsPage() {
  // 2. Define your categories to match your request
  const categories = ["All", "Fertilizer", "Bio Stimulant", "Liquid Fertilizer"];
  
  // 3. State to keep track of active tab
  const [activeTab, setActiveTab] = useState("All");

  // 4. Filter products from the IMPORTED PRODUCTS_DATA based on active tab
  const filteredProducts = activeTab === "All" 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 md:px-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Seedica Products</h1>
        
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === cat 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden bg-white p-4 border-b border-gray-50">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                {product.category}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.desc}</p>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                <span className="text-2xl font-bold text-emerald-600">{product.price}</span>
                <Link href={`/products/${product.id}`}>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State - Shows if a category has no items yet */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg italic">No products found in the "{activeTab}" category.</p>
        </div>
      )}
    </div>
  );
}