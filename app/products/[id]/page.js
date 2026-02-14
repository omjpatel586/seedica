"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PRODUCTS_DATA } from "../../data";

export default function ProductDetail() {
  const params = useParams();
  const product = PRODUCTS_DATA.find((p) => p.id.toString() === params.id);

  // State for Magnifier Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // Calculate mouse position as a percentage for the zoom origin
 const handleMouseMove = (e) => {
  // Only calculate if the screen is Desktop size (over 1024px)
  if (window.innerWidth < 1024) return; 

  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.pageX - left) / width) * 100;
  const y = ((e.pageY - top - window.scrollY) / height) * 100;
  setMousePos({ x, y });
};

  return (
    <div className="min-h-screen bg-white pt-32 pb-12 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* LEFT SIDE: Image Section with Magnifier */}
        <div className="flex-1">
          <div className="sticky top-32">
            <div 
              className="relative h-[550px] w-full border border-gray-100 rounded-3xl overflow-hidden bg-white cursor-zoom-in shadow-sm"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className={`object-contain transition-transform duration-200 ease-out pointer-events-none ${
                  isHovering ? "lg:scale-[2.5]" : "scale-100" 
                }`}
                style={{
                  // Only apply the origin if we are on a large screen
                  transformOrigin: isHovering ? `${mousePos.x}% ${mousePos.y}%` : "center",
                }}
                priority 
              />
              
              {/* Zoom Indicator Icon */}
              {!isHovering && (
                <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full shadow-sm border border-gray-100 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {/* <div className="flex gap-4 mt-6 justify-center">
              <div className="w-20 h-20 border-2 border-emerald-500 rounded-xl p-2 cursor-pointer bg-white transition-all shadow-sm">
                <Image 
                  src={product.image} 
                  alt="thumbnail" 
                  width={80} 
                  height={80} 
                  className="object-contain h-full w-full"
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* RIGHT SIDE: Product Info Section */}
        <div className="flex-1 space-y-8">
          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              {product.category}
            </span>
            <h1 className="text-5xl font-extrabold text-emerald-800 mt-6 leading-tight tracking-tight">
              {product.name}
            </h1>
          </div>
          
          <div className="flex flex-col gap-2">
             <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                <span className="text-gray-400 text-sm font-medium uppercase tracking-tight">( FCO સ્ટાન્ડર્ડ મુજબ પ્રમાણિત )</span>
             </div>
             {/* <p className="text-emerald-600 text-sm font-bold flex items-center gap-2">
               <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
               In Stock - Ready to Ship
             </p> */}
          </div>

          {/* Action Buttons (Restored from your reference) */}
          {/* <div className="flex flex-col gap-4">
            <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-bold py-4 rounded-xl shadow-sm transition-all active:scale-[0.98]">
              Add to Cart
            </button>
            <button className="w-full bg-[#FFA41C] hover:bg-[#FA8914] text-white font-bold py-4 rounded-xl shadow-sm transition-all active:scale-[0.98]">
              Buy Now
            </button>
          </div> */}

          <div className="space-y-4 border-y border-gray-100 py-8">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Product Description
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.desc}
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
             {/* <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">Shipping</p>
                  <p className="text-sm font-bold text-gray-800">Free Delivery</p>
                </div>
             </div> */}
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">Organic</p>
                  <p className="text-sm font-bold text-gray-800">100% Genuine</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}